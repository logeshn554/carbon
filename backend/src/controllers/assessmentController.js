import { z } from 'zod';
import prisma from '../utils/prismaClient.js';
import { calculateAllEmissions } from '../services/carbonCalculator.js';
import { calculateScore, compareToAverages } from '../services/scoringService.js';
import { generateRecommendations } from '../services/recommendationEngine.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Zod schema defining the allowed fields for an assessment request.
 * Used both for validation and as the single source of truth for allowed keys.
 */
const assessmentSchema = z.object({
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
});

/** @constant {Set<string>} ALLOWED_KEYS - The set of keys the schema accepts */
const ALLOWED_KEYS = new Set(Object.keys(assessmentSchema.shape));

/**
 * Percentage divisor for emission breakdown calculation.
 * @constant {number}
 */
const PERCENTAGE_MULTIPLIER = 100;

/**
 * Create a new carbon footprint assessment.
 * Validates input, auto-upserts user if not found, calculates emissions,
 * generates recommendations, and saves everything in a Prisma transaction.
 *
 * @param {import('express').Request} req - Express request (body must match assessmentSchema)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {Promise<void>}
 */
export const createAssessment = async (req, res, next) => {
  try {
    // ── Unknown-key guard ─────────────────────────────────────────────────
    // Reject any keys not defined in the Zod schema to prevent payload
    // pollution or accidental data leakage from over-posting attacks.
    const unknownKeys = Object.keys(req.body).filter((key) => !ALLOWED_KEYS.has(key));
    if (unknownKeys.length > 0) {
      throw new AppError(
        `Unknown fields: ${unknownKeys.join(', ')}. Only these fields are accepted: ${[...ALLOWED_KEYS].join(', ')}`,
        400
      );
    }

    const data = assessmentSchema.parse(req.body);

    // Auto-upsert user — if frontend registration failed or DB was wiped,
    // create the user on the fly so the assessment never fails with "User not found".
    let user = await prisma.user.findUnique({ where: { id: data.userId } });

    // effectiveUserId avoids mutating the Zod-parsed `data` object.
    let effectiveUserId = data.userId;

    if (!user) {
      // NOTE: The email pattern `${id}@ecoguide.ai` is a synthetic, non-PII
      // placeholder used only as a unique key for anonymous user upsert.
      // It is never displayed to end users nor sent in any communications.
      user = await prisma.user.upsert({
        where: { email: `${data.userId}@ecoguide.ai` },
        update: {},
        create: {
          name: 'Anonymous',
          email: `${data.userId}@ecoguide.ai`,
        },
      });
      // Use the actual DB-assigned id for this assessment
      effectiveUserId = user.id;
    }

    // Calculate emissions
    const emissions = calculateAllEmissions(data);
    const score = calculateScore(emissions.totalEmission);

    // Generate recommendations
    const recs = generateRecommendations(data, emissions);

    // Save assessment and recommendations in a transaction.
    // All Prisma queries below use parameterized inputs via the Prisma ORM,
    // which prevents SQL injection by design — values are never interpolated
    // into raw SQL strings.
    const assessment = await prisma.$transaction(async (tx) => {
      const created = await tx.assessment.create({
        data: {
          userId: effectiveUserId,
          dailyCarKm: data.dailyCarKm,
          carFuelType: data.carFuelType,
          publicTransportKmPerWeek: data.publicTransportKmPerWeek,
          cyclingKmPerWeek: data.cyclingKmPerWeek,
          shortFlightsPerYear: data.shortFlightsPerYear,
          longFlightsPerYear: data.longFlightsPerYear,
          monthlyElectricityKwh: data.monthlyElectricityKwh,
          renewablePercentage: data.renewablePercentage,
          dietType: data.dietType,
          clothingItemsPerYear: data.clothingItemsPerYear,
          electronicsItemsPerYear: data.electronicsItemsPerYear,
          transportEmission: emissions.transportEmission,
          energyEmission: emissions.energyEmission,
          foodEmission: emissions.foodEmission,
          shoppingEmission: emissions.shoppingEmission,
          totalEmission: emissions.totalEmission,
          sustainabilityScore: score,
          recommendations: {
            create: recs.map((r) => ({
              title: r.title,
              description: r.description,
              estimatedSavings: r.estimatedSavings,
              priority: r.priority,
              category: r.category,
            })),
          },
        },
        include: {
          recommendations: { orderBy: { estimatedSavings: 'desc' } },
        },
      });
      return created;
    });

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
          transport: parseFloat(((assessment.transportEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)),
          energy: parseFloat(((assessment.energyEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)),
          food: parseFloat(((assessment.foodEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)),
          shopping: parseFloat(((assessment.shoppingEmission / safeTotal) * PERCENTAGE_MULTIPLIER).toFixed(1)),
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
