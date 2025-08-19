import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Get current logged-in user
router.get('/me', authMiddleware, getCurrentUser);

export default router;
