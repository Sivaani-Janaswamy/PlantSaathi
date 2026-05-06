import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js';
import { applyRateLimit } from '../utils/rateLimiter.js';

const router = express.Router();

router.use(authMiddleware);
router.use(applyRateLimit('favorites'));

router.post('/', addFavorite);
router.delete('/:plantId', removeFavorite);
router.get('/', getFavorites);

export default router;
