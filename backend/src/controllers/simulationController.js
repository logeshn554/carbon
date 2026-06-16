import { z } from 'zod';
import prisma from '../utils/prismaClient.js';
import { runSimulation } from '../services/simulationService.js';
import { AppError } from '../middleware/errorHandler.js';

const simulationSchema = z.object({
  assessmentId: z.string().min(1, 'assessmentId is required'),
  scenarioName: z.string().min(1, 'scenarioName is required').max(100),
  scenarioParams: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

export const createSimulation = async (req, res, next) => {
  try {
    const data = simulationSchema.parse(req.body);

    const assessment = await prisma.assessment.findUnique({
      where: { id: data.assessmentId },
    });
    if (!assessment) throw new AppError('Assessment not found', 404);

    // Extract assessment input data
    const assessmentData = {
      dailyCarKm: assessment.dailyCarKm,
      carFuelType: assessment.carFuelType,
      publicTransportKmPerWeek: assessment.publicTransportKmPerWeek,
      cyclingKmPerWeek: assessment.cyclingKmPerWeek,
      shortFlightsPerYear: assessment.shortFlightsPerYear,
      longFlightsPerYear: assessment.longFlightsPerYear,
      monthlyElectricityKwh: assessment.monthlyElectricityKwh,
      renewablePercentage: assessment.renewablePercentage,
      dietType: assessment.dietType,
      clothingItemsPerYear: assessment.clothingItemsPerYear,
      electronicsItemsPerYear: assessment.electronicsItemsPerYear,
    };

    const result = runSimulation(assessmentData, data.scenarioParams, data.scenarioName);

    const simulation = await prisma.simulation.create({
      data: {
        assessmentId: data.assessmentId,
        scenarioName: result.scenarioName,
        scenarioParams: result.scenarioParams,
        originalEmission: result.originalEmission,
        projectedEmission: result.projectedEmission,
        reductionPercentage: result.reductionPercentage,
        annualSavingsKg: result.annualSavingsKg,
      },
    });

    res.status(201).json({ success: true, data: { ...simulation, ...result } });
  } catch (err) {
    next(err);
  }
};

export const getSimulationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const simulation = await prisma.simulation.findUnique({
      where: { id },
      include: {
        assessment: {
          select: { id: true, totalEmission: true, sustainabilityScore: true, userId: true },
        },
      },
    });

    if (!simulation) throw new AppError('Simulation not found', 404);

    res.json({ success: true, data: simulation });
  } catch (err) {
    next(err);
  }
};
