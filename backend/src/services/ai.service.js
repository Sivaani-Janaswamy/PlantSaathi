// Contains business logic for AI assistant

const supabase = require('../config/supabaseClient');
const { logActivity } = require('../utils/activityLogger');

// Global in-memory cache
const aiCache = new Map();
exports.cache = aiCache;


exports.askQuestion = async (question, userId = null) => {
  if (userId) {
    try {
      logActivity(userId, 'ai_query', { query: question });
    } catch (e) {
      // Activity logging must never block an answer.
    }
  }

  // ================= CACHE =================
  const cacheKey = `${userId || ''}::${question}`;
  if (aiCache.has(cacheKey)) {
    return aiCache.get(cacheKey);
  }

  // ================= API CALL =================
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return "AI service busy, try again later";
  }

  let answer = "";
  let apiTimedOut = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    apiTimedOut = true;
    controller.abort();
  }, 10000); // 10 seconds

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are a plant expert. Answer clearly: ${question}`
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return "AI service busy, try again later";
    }
    const data = await response.json();
    answer =
      data.output?.[0]?.content?.[0]?.text ||
      "AI service busy, try again later";
    if (apiTimedOut) {
      return "AI service busy, try again later";
    }
  } catch (err) {
    clearTimeout(timeout);
    return "AI service busy, try again later";
  }

  // ================= CACHE SAVE =================
  aiCache.set(cacheKey, answer);

  // ================= DB SAVE (non-blocking) =================
  (async () => {
    const logger = require('../utils/logger');
    try {
      logger.dbQuery('ai_responses', 'insert');
      const dbStart = Date.now();
      await supabase
        .from('ai_responses')
        .insert([{ user_id: userId, question, answer }]);
      const dbMs = Date.now() - dbStart;
      logger.dbResponse('ai_responses', 'insert', true, dbMs);
    } catch (err) {
      logger.dbError(err.message, 'ai_responses', 'insert');
      logger.dbResponse('ai_responses', 'insert', false, 0);
    }
  })();

  return answer || "AI service failed, try again";
};
