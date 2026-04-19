// Contains business logic for AI assistant

const supabase = require('../config/supabaseClient');
const { logActivity } = require('../utils/activityLogger');

// Error types for better classification
const ERROR_TYPES = {
  CONFIGURATION: 'configuration_error',
  NETWORK: 'network_error',
  TIMEOUT: 'timeout_error',
  API_LIMIT: 'api_limit_error',
  AUTHENTICATION: 'authentication_error',
  INVALID_RESPONSE: 'invalid_response_error',
  VALIDATION: 'validation_error',
  UNKNOWN: 'unknown_error'
};

// Global in-memory cache with TTL support
const aiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;
exports.cache = aiCache;

// Helper function to classify errors
function classifyError(error, response) {
  if (error.name === 'AbortError') {
    return ERROR_TYPES.TIMEOUT;
  }
  
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return ERROR_TYPES.NETWORK;
  }
  
  if (response) {
    if (response.status === 401) {
      return ERROR_TYPES.AUTHENTICATION;
    }
    if (response.status === 429) {
      return ERROR_TYPES.API_LIMIT;
    }
    if (response.status >= 500) {
      return ERROR_TYPES.NETWORK;
    }
  }
  
  return ERROR_TYPES.UNKNOWN;
}

// Helper function to get user-friendly error message
function getErrorMessage(errorType, details = '') {
  const messages = {
    [ERROR_TYPES.CONFIGURATION]: 'AI service is not configured. Please contact support.',
    [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection and try again.',
    [ERROR_TYPES.TIMEOUT]: 'AI service is taking too long to respond. Please try again.',
    [ERROR_TYPES.API_LIMIT]: 'AI service has reached its usage limit. Please try again later.',
    [ERROR_TYPES.AUTHENTICATION]: 'AI service authentication failed. Please contact support.',
    [ERROR_TYPES.INVALID_RESPONSE]: 'AI service returned an invalid response. Please try again.',
    [ERROR_TYPES.VALIDATION]: 'Invalid question format. Please ask a clear plant-related question.',
    [ERROR_TYPES.UNKNOWN]: 'AI service is temporarily unavailable. Please try again later.'
  };
  
  return messages[errorType] || messages[ERROR_TYPES.UNKNOWN];
}

// Cache management functions
function getFromCache(key) {
  const cached = aiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    aiCache.delete(key);
  }
  return null;
}

function setCache(key, data) {
  // Implement LRU eviction if cache is full
  if (aiCache.size >= MAX_CACHE_SIZE) {
    const firstKey = aiCache.keys().next().value;
    aiCache.delete(firstKey);
  }
  
  aiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

exports.askQuestion = async (question, userId = null) => {
  // Input validation
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return getErrorMessage(ERROR_TYPES.VALIDATION);
  }
  
  if (question.length > 1000) {
    return 'Question is too long. Please keep it under 1000 characters.';
  }

  if (userId) {
    try {
      logActivity(userId, 'ai_query', { query: question });
    } catch (e) {
      // Activity logging must never block an answer.
    }
  }

  // ================= CACHE =================
  const cacheKey = `${userId || ''}::${question}`;
  const cachedAnswer = getFromCache(cacheKey);
  if (cachedAnswer) {
    return cachedAnswer;
  }

  // ================= API CALL =================
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return getErrorMessage(ERROR_TYPES.CONFIGURATION);
  }

  let answer = "";
  let apiTimedOut = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    apiTimedOut = true;
    controller.abort();
  }, 15000); // Increased to 15 seconds

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a plant expert. Answer clearly and concisely. If the question is not about plants, politely redirect to plant-related topics."
          },
          {
            role: "user", 
            content: question.trim()
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorType = classifyError(null, response);
      return getErrorMessage(errorType);
    }
    
    const data = await response.json();
    
    // Check for valid response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return getErrorMessage(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    answer = data.choices[0].message.content?.trim();
    
    if (!answer) {
      return getErrorMessage(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    if (apiTimedOut) {
      return getErrorMessage(ERROR_TYPES.TIMEOUT);
    }
    
  } catch (err) {
    clearTimeout(timeout);
    const errorType = classifyError(err, null);
    return getErrorMessage(errorType);
  }

  // ================= CACHE SAVE =================
  setCache(cacheKey, answer);

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

  return answer;
};
