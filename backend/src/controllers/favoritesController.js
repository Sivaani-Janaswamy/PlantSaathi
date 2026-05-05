import { supabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const addFavorite = async (req, res, next) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.id;

    if (!plantId) {
      throw new AppError('Plant ID is required', 400);
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, plant_id: plantId })
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const userId = req.user.id;

    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('plant_id', plantId);

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const { data, count, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        plants!inner(id, common_name, scientific_name, plant_type)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data.map(fav => fav.plants),
      total: count
    });
  } catch (error) {
    next(error);
  }
};
