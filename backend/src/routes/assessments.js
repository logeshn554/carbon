import { Router } from 'express';
import {
  createAssessment,
  getAssessmentById,
  getAssessmentsByUser,
} from '../controllers/assessmentController.js';

const router = Router();

/**
 * @route   POST /api/assessments
 * @desc    Create a new carbon footprint assessment
 * @access  Public
 */
router.post('/', createAssessment);

/**
 * @route   GET /api/assessments/user/:userId
 * @desc    Get all assessments for a user
 * @access  Public
 * NOTE: This route must come before /:id to avoid param conflicts
 */
router.get('/user/:userId', getAssessmentsByUser);

/**
 * @route   GET /api/assessments/:id
 * @desc    Get a specific assessment by ID
 * @access  Public
 */
router.get('/:id', getAssessmentById);

export default router;
