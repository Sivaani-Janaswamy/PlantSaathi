import { supabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const plantService = {
  async search(query, options = {}) {
    const { type, limit = 20, offset = 0 } = options;

    try {
      let builder = supabase
        .from('plants')
        .select('id, common_name, scientific_name, plant_type, difficulty_level', {
          count: 'exact'
        })
        .or(`common_name.ilike.%${query}%,scientific_name.ilike.%${query}%,description.ilike.%${query}%`);

      if (type) {
        builder = builder.eq('plant_type', type);
      }

      const { data, count, error } = await builder
        .range(offset, offset + limit - 1)
        .order('common_name', { ascending: true });

      if (error) throw error;

      return { data, total: count || 0 };
    } catch (error) {
      throw new AppError(`Search failed: ${error.message}`, 500);
    }
  },

  async getById(plantId) {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select(`
          *,
          plant_images(image_url, alt_text, is_primary)
        `)
        .eq('id', plantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Plant not found', 404);
    }
  },

  async getRecommendations(type, limit) {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('id, common_name, scientific_name, plant_type, difficulty_level')
        .eq('plant_type', type)
        .eq('difficulty_level', 'beginner')
        .limit(limit)
        .order('common_name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to fetch recommendations', 500);
    }
  }
};
