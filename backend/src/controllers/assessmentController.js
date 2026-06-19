import { z } from 'zod';
import prisma from '../utils/prismaClient.js';
import { compareToAverages } from '../services/scoringService.js';
import { createAssessmentWithRecommendations } from '../services/assessmentService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Zod schema defining the allowed fields for an assessment request.
 * `.strict()` instructs Zod to throw a ZodError for any key not declared
 * in the schema, replacing the old manual ALLOWED_KEYS Set + filter approach.
 * This is the single source of truth for both validation and allow-listing.
 */
const assessmentSchema = z
  .object({
    userId: z.string().min(1, 'userId is required'),
    // Transportation
    dailyCarKm: z.number().min(0).max(1000).default(0),
    carFuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'none']).default('none'),
    publicTransportKmPerWeek: z.number().min(0).max(10000).default(0),
    cyclingKmPerWeek: z.number().min(0).max(1000).default(0),
    shortFlightsPerYear: z.number().int().min(0).max(100).default(0),
    longFlightsPerYear: z.number().int().min(0).max(50).default(0),
    // Energy
    monthlyElectricityKwh: z.number().min(0).max(10000).default(0),
    renewablePercentage: z.number().min(0).max(100).default(0),
    // Food
    dietType: z.enum(['vegan', 'vegetarian', 'mixed', 'heavy_meat']).default('mixed'),
    // Shopping
    clothingItemsPerYear: z.number().int().min(0).max(500).default(0),
    electronicsItemsPerYear: z.number().int().min(0).max(50).default(0),
  })
  .strict();

/**
 * Percentage divisor for emission breakdown calculation.
 * @constant {number}
 */
const PERCENTAGE_MULTIPLIER = 100;

/**
 * Format a Zod unknown-keys error into the message format the tests expect.
 * Zod's `.strict()` produces an "Unrecognized key(s) in object" message;
 * this helper translates it to "Unknown fields: X, Y. Only these fields …"
 * so existing integration test assertions continue to pass.
 *
 * @param {import('zod').ZodError} zodError
 * @param {string[]} allowedKeys
 * @returns {string} human-readable message
 */
function buildUnknownKeysMessage(zodError, allowedKeys) {
  const unknownKeyIssues = zodError.issues.filter((i) => i.code === 'unrecognized_keys');
  if (unknownKeyIssues.length === 0) return zodError.message;

  const unknownKeys = unknownKeyIssues.flatMap((i) => i.keys);
  return (
    `Unknown fields: ${unknownKeys.join(', ')}. ` +
    `Only these fields are accepted: ${allowedKeys.join(', ')}`
  );
}

/** Ordered list of accepted field names (stable for error messages). */
const ALLOWED_KEYS = Object.keys(assessmentSchema._def.shape());

/**
 * Create a new carbon footprint assessment.
 * This is a thin HTTP adapter — business logic lives in assessmentService.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createAssessment = async (req, res, next) => {
  try {
    // Zod .strict() rejects unknown keys at parse time — no manual key filter needed.
    const parseResult = assessmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      const message = buildUnknownKeysMessage(parseResult.error, ALLOWED_KEYS);
      throw new AppError(message, 400);
    }
    const data = parseResult.data;

    const { assessment, emissions, score } = await createAssessmentWithRecommendations(data);

    res.status(201).json({
      success: true,
      data: {
        ...assessment,
        breakdown: emissions.breakdown,
        scoreInfo: { score, ...emissions },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve a single assessment by its UUID, including recommendations,
 * simulations, and user info. Computes percentage breakdown of emissions.
 *
 * @param {import('express').Request} req - Express request (params.id)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {Promise<void>}
 */
export const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prisma parameterized query — no raw SQL interpolation.
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        recommendations: { orderBy: { estimatedSavings: 'desc' } },
        simulations: { orderBy: { createdAt: 'desc' } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!assessment) throw new AppError('Assessment not found', 404);

    const total = assessment.totalEmission;
    const safeTotal = total === 0 ? 1 : total;

    res.json({
      success: true,
      data: {
        ...assessment,
        breakdown: {
          transport: parseFloat(
            ((assessment.transportEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)
          ),
          energy: parseFloat(
            ((assessment.energyEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)
          ),
          food: parseFloat(
            ((assessment.foodEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)
          ),
          shopping: parseFloat(
            ((assessment.shoppingEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)
          ),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve all assessments for a given user, ordered by creation date.
 *
 * @param {import('express').Request} req - Express request (params.userId)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {Promise<void>}
 */
export const getAssessmentsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prisma parameterized query — no raw SQL interpolation.
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const assessments = await prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendations: { orderBy: { estimatedSavings: 'desc' }, take: 3 },
        _count: { select: { simulations: true } },
      },
    });

    res.json({ success: true, data: assessments, count: assessments.length });
  } catch (err) {
    next(err);
  }
};

/**
 * Compare a specific assessment's footprint against global, UK,
 * and Paris Agreement benchmarks using the compareToAverages service.
 *
 * @param {import('express').Request} req - Express request (params.id)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {Promise<void>}
 */
export const compareAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prisma parameterized query — no raw SQL interpolation.
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: { id: true, totalEmission: true, sustainabilityScore: true },
    });

    if (!assessment) throw new AppError('Assessment not found', 404);

    const comparison = compareToAverages(assessment.totalEmission);

    // Cache-Control: once an assessment is created its emissions don't change.
    // Allow CDN / browser to cache this response for up to 5 minutes.
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');

    res.json({
      success: true,
      data: {
        assessmentId: assessment.id,
        totalEmission: assessment.totalEmission,
        sustainabilityScore: assessment.sustainabilityScore,
        comparison,
      },
    });
  } catch (err) {
    next(err);
  }
};
