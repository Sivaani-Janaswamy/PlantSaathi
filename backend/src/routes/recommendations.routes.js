const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const recommendationsController = require('../controllers/recommendations.controller');

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get personalized plant recommendations for the user
 *     responses:
 *       200:
 *         description: List of recommended plants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plant'
 */
router.get('/', auth, recommendationsController.getRecommendations);

module.exports = router;
