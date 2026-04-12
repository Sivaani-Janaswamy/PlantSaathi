const express = require('express');
const router = express.Router();

const plantController = require('../controllers/plant.controller');
const upload = require('../config/multer');

/**
 * @swagger
 * /plants/search:
 *   get:
 *     summary: Search for plants by name
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plant'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/search', plantController.searchPlants);

// GET /plants/recommendations (auth required)
const auth = require('../middlewares/auth.middleware');
router.get('/recommendations', auth, plantController.getRecommendations);

/**
 * @swagger
 * /plants/{id}:
 *   get:
 *     summary: Get plant details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Plant ID
 *     responses:
 *       200:
 *         description: Plant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       404:
 *         description: Plant not found
 */
router.get('/:id', plantController.getPlantById);

/**
 * @swagger
 * /plants/identify:
 *   post:
 *     summary: Identify a plant from an image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Identified plant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 */
router.post('/identify', upload.single('image'), plantController.identifyPlant);

module.exports = router;
