// User-based rate limiting utilities

//const rateLimit = require('express-rate-limit');

// Store for user-specific request counts
const userStore = new Map();

// Cleanup interval for old entries (5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of userStore.entries()) {
    if (now - data.resetTime > CLEANUP_INTERVAL) {
      userStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Create a user-based rate limiter
 * @param {object} options - Rate limiting options
 * @returns {function} - Express middleware function
 */
function createUserRateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // max requests per window
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req, res, next) => {
    // Get user ID from request (set by auth middleware)
    const userId = req.user?.id;
    
    // Fallback to IP-based limiting if no user ID
    const identifier = userId || req.ip || 'anonymous';
    
    const now = Date.now();
    const key = `${identifier}`;
    
    // Get or create user record
    let userRecord = userStore.get(key);
    
    if (!userRecord || now > userRecord.resetTime) {
      // Create new record or reset existing one
      userRecord = {
        count: 0,
        resetTime: now + windowMs,
        windowMs
      };
      userStore.set(key, userRecord);
    }
    
    // Increment request count
    userRecord.count++;
    
    // Calculate remaining requests and reset time
    const remaining = Math.max(0, max - userRecord.count);
    const resetTime = Math.ceil((userRecord.resetTime - now) / 1000);
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': resetTime
    });
    
    // Check if limit exceeded
    if (userRecord.count > max) {
      return res.status(429).json({
        success: false,
        message: message,
        retryAfter: resetTime
      });
    }
    
    next();
  };
}

/**
 * Create different rate limiters for different endpoints
 */
const rateLimiters = {
  // General API rate limit (per user)
  general: createUserRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'Rate limit exceeded. Please try again later.'
  }),
  
  // AI endpoint rate limit (more restrictive)
  ai: createUserRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 AI requests per 15 minutes
    message: 'AI query limit reached. Please try again later.'
  }),
  
  // Plant identification rate limit (very restrictive)
  identify: createUserRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 identifications per hour
    message: 'Plant identification limit reached. Please try again later.'
  }),
  
  // Search endpoint rate limit
  search: createUserRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 searches per 15 minutes
    message: 'Search limit reached. Please try again later.'
  }),
  
  // Favorites operations rate limit
  favorites: createUserRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 favorite operations per 15 minutes
    message: 'Favorites limit reached. Please try again later.'
  })
};

/**
 * Middleware to apply rate limiting based on endpoint
 * @param {string} type - Type of rate limiter to apply
 * @returns {function} - Express middleware function
 */
function applyRateLimit(type) {
  const limiter = rateLimiters[type];
  if (!limiter) {
    throw new Error(`Unknown rate limiter type: ${type}`);
  }
  return limiter;
}

/**
 * Get current rate limit status for a user
 * @param {string} userId - User ID
 * @returns {object} - Rate limit status
 */
function getUserRateLimitStatus(userId) {
  const key = userId;
  const userRecord = userStore.get(key);
  
  if (!userRecord) {
    return {
      limit: 100,
      remaining: 100,
      resetTime: 0,
      resetInSeconds: 0
    };
  }
  
  const now = Date.now();
  const remaining = Math.max(0, 100 - userRecord.count);
  const resetTime = Math.ceil((userRecord.resetTime - now) / 1000);
  
  return {
    limit: 100,
    remaining,
    resetTime: userRecord.resetTime,
    resetInSeconds: resetTime
  };
}

/**
 * Reset rate limit for a specific user (admin function)
 * @param {string} userId - User ID to reset
 */
function resetUserRateLimit(userId) {
  const key = userId;
  userStore.delete(key);
}

module.exports = {
  createUserRateLimit,
  rateLimiters,
  applyRateLimit,
  getUserRateLimitStatus,
  resetUserRateLimit
};
