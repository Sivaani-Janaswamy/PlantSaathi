import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addFavorite);
router.delete('/:plantId', removeFavorite);
router.get('/', getFavorites);

export default router;
