const express = require('express');
const router = express.Router();

const aiController = require('../controllers/ai.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/ask', auth, (req, res, next) => {
	console.log('[AI ROUTE] Authorization:', req.headers.authorization);
	console.log('[AI ROUTE] Body:', req.body);
	return aiController.askAI(req, res, next);
});

module.exports = router;
