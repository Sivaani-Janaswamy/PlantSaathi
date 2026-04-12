const express = require('express');
const router = express.Router();

const aiController = require('../controllers/ai.controller');
const auth = require('../middlewares/auth.middleware');

// POST /ai/ask
router.post('/ask', auth, aiController.askAI);

module.exports = router;
