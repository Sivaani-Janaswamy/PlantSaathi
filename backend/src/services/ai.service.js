// Contains business logic for AI assistant

const supabase = require('../config/supabaseClient');

const { logActivity } = require('../utils/activityLogger');


// Global in-memory cache for AI answers
const aiCache = new Map();
exports.cache = aiCache;

exports.askQuestion = async (question, userId = null) => {
  if (userId) logActivity(userId, 'ai_query', { query: question });

  // 1. Check in-memory cache at VERY TOP
  const cacheKey = `${userId || ''}::${question}`;
  if (aiCache.has(cacheKey)) {
    console.log('CACHE HIT');
    return aiCache.get(cacheKey);
  }

  // 2. ONLY call external AI API if not cached
  console.log('API CALLED');
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: 'AI service failed: missing API key' };
  }
  const prompt = `You are a plant expert. Answer clearly and concisely: ${question}`;
  let answer;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json',
	'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
	model: 'gpt-3.5-turbo',
	messages: [
	  { role: 'system', content: 'You are a plant expert.' },
	  { role: 'user', content: prompt }
	],
	max_tokens: 256,
	temperature: 0.7
      }),
      timeout: 10000
    });
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    const data = await response.json();
    answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!answer) {
      throw new Error('AI API returned invalid response');
    }
    answer = answer.trim();
  } catch (err) {
    throw { status: 500, message: 'AI service failed' };
  }

  // 3. Save response to in-memory cache and DB AFTER API call
  aiCache.set(cacheKey, answer);
  try {
    await supabase
      .from('ai_responses')
      .insert([{ user_id: userId, question, answer }]);
  } catch (err) {
    // Log but do not block on cache insert errors
  }
  return answer;
};
