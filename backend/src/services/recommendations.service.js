const supabase = require('../config/supabaseClient');

exports.getRecommendations = async (userId) => {
  // Step 1: Fetch recent user activity
  let activity = [];
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('activity_type, reference_id, query')
      .eq('user_id', userId)
      .in('activity_type', ['search', 'plant_view'])
      .order('created_at', { ascending: false })
      .limit(15);
    if (!error && data) activity = data;
  } catch {}

  // Step 2: Extract signals
  const plantIds = activity.filter(a => a.activity_type === 'plant_view' && a.reference_id).map(a => a.reference_id);
  const searchQueries = activity.filter(a => a.activity_type === 'search' && a.query).map(a => a.query);

  // Step 3: Fetch recommendations
  let plantResults = [];
  let searchResults = [];

  if (plantIds.length > 0) {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .in('id', plantIds)
      .limit(5);
    if (!error && data) plantResults = data;
  }

  if (searchQueries.length > 0) {
    for (const q of searchQueries) {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .or(`common_name.ilike.%${q}%,scientific_name.ilike.%${q}%`)
        .limit(5);
      if (!error && data) searchResults.push(...data);
    }
  }

  // Step 4: Combine results, remove duplicates, limit to 10
  const all = [...plantResults, ...searchResults];
  const seen = new Set();
  const combined = all.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id); return true;
  }).slice(0, 10);

  // Step 5: Fallback
  if (combined.length === 0) {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error && data) return data;
    return [];
  }
  return combined;
};
