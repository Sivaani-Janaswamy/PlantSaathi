import express from 'express';
import { searchPlants, getPlantDetail, getRecommendations } from '../controllers/plantController.js';

const router = express.Router();

router.get('/search', searchPlants);
router.get('/recommendations', getRecommendations);
router.get('/:plantId', getPlantDetail);

export default router;
