const supabase = require('../config/supabaseClient');

/**
 * Log user activity to user_activity table.
 * @param {string} userId - The user's UUID
 * @param {string} activityType - One of 'search', 'ai_query', 'plant_view'
 * @param {Object} options
 * @param {string|null} [options.referenceId]
 * @param {string|null} [options.query]
 */
async function logActivity(userId, activityType, { referenceId = null, query = null } = {}) {
  if (!userId || !activityType) return;
  try {
    await supabase.from('user_activity').insert([
      {
        user_id: userId,
        activity_type: activityType,
        reference_id: referenceId,
        query: query
      }
    ]);
  } catch (err) {
    // Fail silently
  }
}

module.exports = { logActivity };
