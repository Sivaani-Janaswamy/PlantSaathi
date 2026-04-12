const express = require('express');
const router = express.Router();

const aiController = require('../controllers/ai.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /ai/ask:
 *   post:
 *     summary: Ask the AI assistant a question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 */
router.post('/ask', auth, aiController.askAI);

module.exports = router;
