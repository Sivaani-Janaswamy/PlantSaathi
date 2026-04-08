const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /ai/ask
router.post('/ask', aiController.askAI);

module.exports = router;
