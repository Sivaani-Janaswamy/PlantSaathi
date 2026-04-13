const recommendationsService = require('../services/recommendations.service');

exports.getRecommendations = async (req, res, next) => {
  console.log('[RECO] req.user:', req.user);
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    console.log('[RECO] Fetching user activity for user:', req.user?.id);
    const data = await recommendationsService.getRecommendations(req.user.id);
    console.log('[RECO] user_activity result:', data);
    console.log('[RECO] Final recommendations:', data);
    res.status(200).json({ data });
  } catch (err) {
    console.log('[RECO ERROR]', err);
    return res.status(500).json({ message: err.message });
  }
};
