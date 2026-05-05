import { plantService } from '../services/plantService.js';
import { AppError } from '../middleware/errorHandler.js';

export const searchPlants = async (req, res, next) => {
  try {
    const { q, type, limit = 20, offset = 0 } = req.query;

    if (!q || q.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    if (parseInt(limit) > 100) {
      throw new AppError('Limit cannot exceed 100', 400);
    }

    const results = await plantService.search(q, {
      type,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: results.data,
      total: results.total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
};

export const getPlantDetail = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const plant = await plantService.getById(plantId);

    res.json({ success: true, data: plant });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { type = 'herb', limit = 10 } = req.query;

    const recommendations = await plantService.getRecommendations(type, parseInt(limit));

    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};
