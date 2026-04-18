
const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

function uniquePlants(plants) {
  const seen = new Set();
  return plants.filter((plant) => {
    if (!plant || !plant.id || seen.has(plant.id)) {
      return false;
    }
    seen.add(plant.id);
    return true;
  });
}

exports.getRecommendations = async (userId) => {
  let activity = [];
  try {
    logger.dbQuery('user_activity', 'select');
    const dbStart = Date.now();
    const { data, error } = await supabase
      .from('user_activity')
      .select('activity_type, reference_id, query')
      .eq('user_id', userId)
      .in('activity_type', ['search', 'plant_view'])
      .order('created_at', { ascending: false })
      .limit(15);
    const dbMs = Date.now() - dbStart;
    if (!error && Array.isArray(data)) {
      logger.dbResponse('user_activity', 'select', true, dbMs);
      activity = data;
    } else if (error) {
      logger.dbError(error.message, 'user_activity', 'select');
      logger.dbResponse('user_activity', 'select', false, dbMs);
    }
  } catch (_) {
    activity = [];
  }

  const plantIds = [];
  const searchQueries = [];

  for (const entry of activity) {
    if (entry.activity_type === 'plant_view' && entry.reference_id) {
      plantIds.push(entry.reference_id);
    }
    if (entry.activity_type === 'search' && entry.query) {
      searchQueries.push(entry.query);
    }
  }

  const recommended = [];

  if (plantIds.length > 0) {
    try {
      logger.dbQuery('plants', 'recommendByIds');
      const dbStart = Date.now();
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .in('id', plantIds)
        .limit(5);
      const dbMs = Date.now() - dbStart;
      if (!error && Array.isArray(data)) {
        logger.dbResponse('plants', 'recommendByIds', true, dbMs);
        recommended.push(...data);
      } else if (error) {
        logger.dbError(error.message, 'plants', 'recommendByIds');
        logger.dbResponse('plants', 'recommendByIds', false, dbMs);
      }
    } catch (_) {}
  }

  if (searchQueries.length > 0) {
    for (const query of searchQueries) {
      try {
        logger.dbQuery('plants', 'recommendByQuery');
        const dbStart = Date.now();
        const { data, error } = await supabase
          .from('plants')
          .select('*')
          .or(`common_name.ilike.%${query}%,scientific_name.ilike.%${query}%`)
          .limit(5);
        const dbMs = Date.now() - dbStart;
        if (!error && Array.isArray(data)) {
          logger.dbResponse('plants', 'recommendByQuery', true, dbMs);
          recommended.push(...data);
        } else if (error) {
          logger.dbError(error.message, 'plants', 'recommendByQuery');
          logger.dbResponse('plants', 'recommendByQuery', false, dbMs);
        }
      } catch (_) {}
    }
  }

  const deduped = uniquePlants(recommended).slice(0, 10);
  if (deduped.length > 0) {
    return deduped;
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (_) {}

  return [];
};
