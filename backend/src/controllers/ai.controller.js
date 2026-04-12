// Handles AI assistant API requests
const aiService = require('../services/ai.service');

exports.askAI = async (req, res, next) => {
	try {
		const { question } = req.body;
		if (!question || typeof question !== 'string' || question.trim() === '') {
			return res.status(400).json({ message: 'Missing or invalid question' });
		}
		const answer = await aiService.askQuestion(question);
		res.status(200).json({ answer });
	} catch (err) {
		next(err);
	}
};
