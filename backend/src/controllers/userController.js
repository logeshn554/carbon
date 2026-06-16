import { z } from 'zod';
import prisma from '../utils/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
});

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = createUserSchema.parse(req.body);

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { name, email },
      include: {
        _count: { select: { assessments: true } },
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { assessments: true } },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
