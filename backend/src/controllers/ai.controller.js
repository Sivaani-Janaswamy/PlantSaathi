const aiService = require('../services/ai.service');
exports.askAI = async (req, res, next) => {
  console.log('✅ CONTROLLER Hit and [AI] Received question:', req.body.question);
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'Missing or invalid question' });
    }

    const userId = req.user.id;

    let answer;
    try {
      answer = await aiService.askQuestion(question, userId);
    } catch (err) {
      // On any error, always return fallback string
      console.error('[AI ERROR]', err);
      answer = "AI service busy, try again later";
    }

    console.log("✅ CONTROLLER RETURNING:", answer);
    return res.status(200).json({ success: true, data: { answer } });

  } catch (err) {
    // Only handle truly unexpected errors (not AI failures)
    console.error('[AI CONTROLLER ERROR]', err);
    return res.status(200).json({ success: true, data: { answer: "AI service busy, try again later" } });
  }
};