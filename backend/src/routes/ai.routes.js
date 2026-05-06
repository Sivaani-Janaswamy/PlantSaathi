import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { chat } from '../controllers/aiController.js';
import { applyRateLimit } from '../utils/rateLimiter.js';

const router = express.Router();

router.post('/chat', optionalAuth, applyRateLimit('ai'), chat);

export default router;
