// Debug script to identify the exact source of the schema.validate error

console.log('=== DEBUGGING SCHEMA.VALIDATE ERROR ===\n');

// Test 1: Basic Node.js and Express setup
console.log('1. Testing basic Node.js setup...');
try {
  const express = require('express');
  console.log('   Express loaded successfully');
} catch (error) {
  console.error('   Express error:', error.message);
  console.error('   Stack:', error.stack);
}

// Test 2: Load app without starting server
console.log('\n2. Testing app loading...');
try {
  const app = require('./app');
  console.log('   App loaded successfully');
  console.log('   App type:', typeof app);
} catch (error) {
  console.error('   App loading error:', error.message);
  console.error('   Stack:', error.stack);
}

// Test 3: Load individual route files
console.log('\n3. Testing individual route files...');
try {
  const plantRoutes = require('./src/routes/plant.routes');
  console.log('   Plant routes loaded successfully');
} catch (error) {
  console.error('   Plant routes error:', error.message);
  console.error('   Stack:', error.stack);
}

try {
  const aiRoutes = require('./src/routes/ai.routes');
  console.log('   AI routes loaded successfully');
} catch (error) {
  console.error('   AI routes error:', error.message);
  console.error('   Stack:', error.stack);
}

try {
  const favoriteRoutes = require('./src/routes/favorite.routes');
  console.log('   Favorite routes loaded successfully');
} catch (error) {
  console.error('   Favorite routes error:', error.message);
  console.error('   Stack:', error.stack);
}

try {
  const recommendationsRoutes = require('./src/routes/recommendations.routes');
  console.log('   Recommendations routes loaded successfully');
} catch (error) {
  console.error('   Recommendations routes error:', error.message);
  console.error('   Stack:', error.stack);
}

// Test 4: Load middleware files
console.log('\n4. Testing middleware files...');
try {
  const { rateLimiters } = require('./src/utils/rateLimiter');
  console.log('   Rate limiter loaded successfully');
} catch (error) {
  console.error('   Rate limiter error:', error.message);
  console.error('   Stack:', error.stack);
}

try {
  const { validators } = require('./src/utils/validator');
  console.log('   Validators loaded successfully');
} catch (error) {
  console.error('   Validators error:', error.message);
  console.error('   Stack:', error.stack);
}

try {
  const { sanitizeRequestBody } = require('./src/utils/sanitizer');
  console.log('   Sanitizer loaded successfully');
} catch (error) {
  console.error('   Sanitizer error:', error.message);
  console.error('   Stack:', error.stack);
}

// Test 5: Test Joi specifically
console.log('\n5. Testing Joi...');
try {
  const Joi = require('joi');
  console.log('   Joi version:', Joi.version);
  console.log('   Joi type:', typeof Joi);
  
  // Test basic Joi schema
  const schema = Joi.object({
    name: Joi.string().required()
  });
  console.log('   Joi schema created successfully');
  console.log('   Schema type:', typeof schema);
  console.log('   Schema has validate method:', typeof schema.validate);
  
  // Test validation
  const result = schema.validate({ name: 'test' });
  console.log('   Joi validation works:', !result.error);
} catch (error) {
  console.error('   Joi error:', error.message);
  console.error('   Stack:', error.stack);
}

console.log('\n=== DEBUGGING COMPLETE ===');
