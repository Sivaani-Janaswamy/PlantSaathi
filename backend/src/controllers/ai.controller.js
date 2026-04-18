const aiService = require('../services/ai.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
exports.askAI = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return sendError(res, 400, 'Missing or invalid question');
    }

    const userId = req.user.id;

    let answer;
    try {
      answer = await aiService.askQuestion(question, userId);
    } catch (err) {
      answer = "AI service busy, try again later";
    }

    return sendSuccess(res, 200, { answer });

  } catch (err) {
    return sendSuccess(res, 200, { answer: "AI service busy, try again later" });
  }
};
