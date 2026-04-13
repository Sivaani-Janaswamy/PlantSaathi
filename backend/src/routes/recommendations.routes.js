const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const recommendationsController = require('../controllers/recommendations.controller');

// safety check (prevents silent crash in tests)
if (typeof auth !== 'function') {
  throw new Error('auth middleware is not a function');
}

if (!recommendationsController || typeof recommendationsController.getRecommendations !== 'function') {
  throw new Error('getRecommendations controller missing or not a function');
}

router.get('/', auth, recommendationsController.getRecommendations);

module.exports = router;