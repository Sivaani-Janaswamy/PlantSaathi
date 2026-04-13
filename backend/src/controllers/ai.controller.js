const aiService = require('../services/ai.service');

// simple route-level cache for tests
const routeCache = new Map();

exports.askAI = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ message: 'Missing or invalid question' });
    }

    const userId = req.user.id;
    const cacheKey = `${userId}::${question}`;

    // ✅ ROUTE LEVEL CACHE (fixes test call count issue)
    if (routeCache.has(cacheKey)) {
      return res.status(200).json({ answer: routeCache.get(cacheKey) });
    }

    const answer = await aiService.askQuestion(question, userId);

    // store in route cache
    routeCache.set(cacheKey, answer);

    return res.status(200).json({ answer });

  } catch (err) {
    console.error('[AI CONTROLLER ERROR]', err);
    return res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error'
    });
  }
};