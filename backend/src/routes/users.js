import { Router } from 'express';
import { createUser, getUserById } from '../controllers/userController.js';

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create or find a user by email (upsert)
 * @access  Public
 */
router.post('/', createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserById);

export default router;
