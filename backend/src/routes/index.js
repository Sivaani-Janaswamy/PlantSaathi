import express from 'express';
import plantsRouter from './plants.routes.js';
import aiRouter from './ai.routes.js';
import favoritesRouter from './favorites.routes.js';

const router = express.Router();

router.use('/plants', plantsRouter);
router.use('/ai', aiRouter);
router.use('/favorites', favoritesRouter);

export default router;
