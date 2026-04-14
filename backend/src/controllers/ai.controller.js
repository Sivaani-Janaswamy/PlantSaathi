const aiService = require('../services/ai.service');
exports.askAI = async (req, res, next) => {
  console.log('✅ CONTROLLER Hit and [AI] Received question:', req.body.question);
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ message: 'Missing or invalid question' });
    }

    const userId = req.user.id;

    const answer = await aiService.askQuestion(question, userId);

    console.log("✅ CONTROLLER RETURNING:", answer); // ADD THIS

    return res.status(200).json({ answer });

  } catch (err) {
    console.error('[AI ERROR]', err);
    return next(err); // 🔥 IMPORTANT CHANGE
  }
};