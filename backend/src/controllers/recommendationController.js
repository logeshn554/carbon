import prisma from '../utils/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });
    if (!assessment) throw new AppError('Assessment not found', 404);

    const recommendations = await prisma.recommendation.findMany({
      where: { assessmentId },
      orderBy: [{ priority: 'asc' }, { estimatedSavings: 'desc' }],
    });

    res.json({ success: true, data: recommendations, count: recommendations.length });
  } catch (err) {
    next(err);
  }
};
