import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { chat } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', optionalAuth, chat);

export default router;
