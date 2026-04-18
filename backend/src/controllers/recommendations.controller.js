const recommendationsService = require('../services/recommendations.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.getRecommendations = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return sendError(res, 401, 'Unauthorized');
  }
  try {
    const data = await recommendationsService.getRecommendations(req.user.id);
    return sendSuccess(res, 200, data);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};
