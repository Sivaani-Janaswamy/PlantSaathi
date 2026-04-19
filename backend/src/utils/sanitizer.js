// Input sanitization utilities

const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

// Initialize DOMPurify with a DOM window
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially dirty HTML string
 * @returns {string} - The sanitized HTML string
 */
function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
}

/**
 * Sanitize text input by removing HTML tags and normalizing whitespace
 * @param {string} text - The text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - The sanitized text
 */
function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove HTML tags
  let sanitized = sanitizeHtml(text);
  
  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[\uFFFE\uFFFF]/g, '') // Remove non-characters
    .trim();
  
  // Enforce maximum length
  if (maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize plant name input
 * @param {string} name - The plant name to sanitize
 * @returns {string} - The sanitized plant name
 */
function sanitizePlantName(name) {
  return sanitizeText(name, 100);
}

/**
 * Sanitize AI question input
 * @param {string} question - The question to sanitize
 * @returns {string} - The sanitized question
 */
function sanitizeQuestion(question) {
  return sanitizeText(question, 1000);
}

/**
 * Sanitize email input
 * @param {string} email - The email to sanitize
 * @returns {string} - The sanitized email
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Basic sanitization - remove HTML and trim
  let sanitized = sanitizeText(email, 254).toLowerCase();
  
  // Basic email format validation (just sanitization, not validation)
  sanitized = sanitized.replace(/[^a-z0-9@._-]/g, '');
  
  return sanitized;
}

/**
 * Sanitize user ID input
 * @param {string} userId - The user ID to sanitize
 * @returns {string} - The sanitized user ID
 */
function sanitizeUserId(userId) {
  if (typeof userId !== 'string') {
    return '';
  }
  
  // Remove HTML tags and trim
  let sanitized = sanitizeText(userId, 100);
  
  // Keep only alphanumeric, hyphens, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '');
  
  return sanitized;
}

/**
 * Sanitize pagination parameters
 * @param {object} params - The pagination parameters
 * @returns {object} - The sanitized pagination parameters
 */
function sanitizePagination(params) {
  const sanitized = {};
  
  // Sanitize page number
  if (params.page !== undefined) {
    const page = parseInt(params.page, 10);
    sanitized.page = isNaN(page) || page < 1 ? 1 : Math.min(page, 1000);
  }
  
  // Sanitize limit
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit, 10);
    sanitized.limit = isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 100);
  }
  
  return sanitized;
}

/**
 * Sanitize search query
 * @param {string} query - The search query to sanitize
 * @returns {string} - The sanitized search query
 */
function sanitizeSearchQuery(query) {
  return sanitizeText(query, 100);
}

/**
 * Sanitize custom notes input
 * @param {string} notes - The notes to sanitize
 * @returns {string} - The sanitized notes
 */
function sanitizeCustomNotes(notes) {
  return sanitizeText(notes, 500);
}

/**
 * Middleware to sanitize request body
 * @param {object} options - Sanitization options
 * @returns {function} - Express middleware function
 */
function sanitizeRequestBody(options = {}) {
  return (req, res, next) => {
    try {
      if (req.body && typeof req.body === 'object') {
        // Sanitize common fields
        if (req.body.question && typeof req.body.question === 'string') {
          req.body.question = sanitizeQuestion(req.body.question);
        }
        
        if (req.body.plant_name && typeof req.body.plant_name === 'string') {
          req.body.plant_name = sanitizePlantName(req.body.plant_name);
        }
        
        if (req.body.email && typeof req.body.email === 'string') {
          req.body.email = sanitizeEmail(req.body.email);
        }
        
        if (req.body.custom_notes && typeof req.body.custom_notes === 'string') {
          req.body.custom_notes = sanitizeCustomNotes(req.body.custom_notes);
        }
        
        if (req.body.plant_id && typeof req.body.plant_id === 'string') {
          req.body.plant_id = sanitizeUserId(req.body.plant_id);
        }
        
        // Sanitize any string fields recursively
        sanitizeObjectStrings(req.body);
      }
      
      // Sanitize query parameters
      if (req.query && typeof req.query === 'object') {
        if (req.query.q && typeof req.query.q === 'string') {
          req.query.q = sanitizeSearchQuery(req.query.q);
        }
        
        // Sanitize pagination parameters
        const pagination = sanitizePagination(req.query);
        Object.assign(req.query, pagination);
      }
      
      next();
    } catch (error) {
      console.error('Sanitization error:', error);
      next(error);
    }
  };
}

/**
 * Recursively sanitize all string values in an object
 * @param {object} obj - The object to sanitize
 */
function sanitizeObjectStrings(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        // Apply basic text sanitization to all string fields
        obj[key] = sanitizeText(obj[key], 1000);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively sanitize nested objects
        sanitizeObjectStrings(obj[key]);
      }
    }
  }
}

module.exports = {
  sanitizeHtml,
  sanitizeText,
  sanitizePlantName,
  sanitizeQuestion,
  sanitizeEmail,
  sanitizeUserId,
  sanitizePagination,
  sanitizeSearchQuery,
  sanitizeCustomNotes,
  sanitizeRequestBody,
  sanitizeObjectStrings
};
