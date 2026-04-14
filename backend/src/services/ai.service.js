// Contains business logic for AI assistant

const supabase = require('../config/supabaseClient');
const { logActivity } = require('../utils/activityLogger');

// Global in-memory cache
const aiCache = new Map();
exports.cache = aiCache;


exports.askQuestion = async (question, userId = null) => {
  console.log('[AI SERVICE] Question:', question);

  if (userId) {
    try { logActivity(userId, 'ai_query', { query: question }); } catch (e) { console.warn('[AI LOG] Activity log failed', e); }
  }

  // ================= CACHE =================
  const cacheKey = `${userId || ''}::${question}`;
  console.log('[AI CACHE] Checking...');



  if (aiCache.has(cacheKey)) {
    console.log('[AI CACHE] HIT');
    return aiCache.get(cacheKey);
  }

  console.log('[AI CACHE] MISS');

  // ================= API CALL =================
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.error('[AI ERROR] Missing API key');
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
    console.log('[AI API] Calling OpenAI...');
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
      // On any non-OK (including 429), return fallback immediately
      console.error('[AI API] FAILURE:', response.status, response.statusText);
      return "AI service busy, try again later";
    }
    const data = await response.json();
    console.log('[AI API] RAW RESPONSE:', JSON.stringify(data).slice(0, 200));
    answer =
      data.output?.[0]?.content?.[0]?.text ||
      "AI service busy, try again later";
    console.log('[AI API] Parsed answer:', answer);
    if (apiTimedOut) {
      console.warn('[AI API] Request timed out');
      return "AI service busy, try again later";
    }
  } catch (err) {
    clearTimeout(timeout);
    // On any error, always return fallback
    console.error('[AI ERROR]', err);
    return "AI service busy, try again later";
  }

  // ================= CACHE SAVE =================
  aiCache.set(cacheKey, answer);

  // ================= DB SAVE (non-blocking) =================
  (async () => {
    try {
      await supabase
        .from('ai_responses')
        .insert([{ user_id: userId, question, answer }]);
      console.log('[AI DB] Saved');
    } catch (err) {
      console.warn('[AI DB ERROR]', err.message);
    }
  })();

  return answer || "AI service failed, try again";
};