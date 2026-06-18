import { z } from 'zod';
import prisma from '../utils/prismaClient.js';
import { calculateAllEmissions } from '../services/carbonCalculator.js';
import { calculateScore } from '../services/scoringService.js';
import { generateRecommendations } from '../services/recommendationEngine.js';
import { AppError } from '../middleware/errorHandler.js';

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

export const createAssessment = async (req, res, next) => {
  try {
    const data = assessmentSchema.parse(req.body);

    // Auto-upsert user — if frontend registration failed or DB was wiped,
    // create the user on the fly so the assessment never fails with "User not found"
    let user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      user = await prisma.user.upsert({
        where: { email: `${data.userId}@ecoguide.ai` },
        update: {},
        create: {
          name: 'Anonymous',
          email: `${data.userId}@ecoguide.ai`,
        },
      });
      // Use the actual DB-assigned id for this assessment
      data.userId = user.id;
    }

    // Calculate emissions
    const emissions = calculateAllEmissions(data);
    const score = calculateScore(emissions.totalEmission);

    // Generate recommendations
    const recs = generateRecommendations(data, emissions);

    // Save assessment and recommendations in a transaction
    const assessment = await prisma.$transaction(async (tx) => {
      const created = await tx.assessment.create({
        data: {
          userId: data.userId,
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

export const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

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
          transport: parseFloat(((assessment.transportEmission / safeTotal) * 100).toFixed(1)),
          energy: parseFloat(((assessment.energyEmission / safeTotal) * 100).toFixed(1)),
          food: parseFloat(((assessment.foodEmission / safeTotal) * 100).toFixed(1)),
          shopping: parseFloat(((assessment.shoppingEmission / safeTotal) * 100).toFixed(1)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAssessmentsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

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
