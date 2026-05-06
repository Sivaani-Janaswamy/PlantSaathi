import express from 'express';
import { searchPlants, getPlantDetail, getRecommendations } from '../controllers/plantController.js';
import { applyRateLimit } from '../utils/rateLimiter.js';
import { cacheMiddleware } from '../utils/cacheManager.js';

const router = express.Router();

// Cache search results for 1 hour
router.get('/search', applyRateLimit('search'), (req, res, next) => {
  const cacheKey = `plants:search:${req.query.q}:${req.query.page || 1}`;
  cacheMiddleware(cacheKey, 3600)(req, res, next);
}, searchPlants);

// Cache recommendations for 12 hours
router.get('/recommendations', applyRateLimit('search'), (req, res, next) => {
  const cacheKey = `plants:recommendations:${req.query.type || 'herb'}`;
  cacheMiddleware(cacheKey, 43200)(req, res, next);
}, getRecommendations);

// Cache plant details for 24 hours
router.get('/:plantId', (req, res, next) => {
  const cacheKey = `plants:detail:${req.params.plantId}`;
  cacheMiddleware(cacheKey, 86400)(req, res, next);
}, getPlantDetail);

export default router;
