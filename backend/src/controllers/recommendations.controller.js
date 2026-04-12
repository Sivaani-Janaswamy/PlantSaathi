const recommendationsService = require('../services/recommendations.service');

exports.getRecommendations = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = await recommendationsService.getRecommendations(req.user.id);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
