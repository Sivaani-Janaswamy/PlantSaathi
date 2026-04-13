// tests/utils/createTestApp.js

const express = require('express');

/**
 * Factory to create a test Express app with injectable mocks.
 * @param {Object} options
 * @param {Function} [options.authMiddleware] - Auth middleware function (req, res, next)
 * @param {Object} [options.aiService] - AI service mock (optional, for DI)
 * @param {Object} [options.supabaseMock] - Supabase mock (optional, for DI)
 * @returns {Express.Application}
 */
function createTestApp({ authMiddleware, aiService, supabaseMock } = {}) {
  const app = express();
  app.use(express.json());

  // Auth middleware (default: always authenticated)
  app.use((authMiddleware || ((req, res, next) => {
    req.user = { id: 'test-user' };
    next();
  })));

  // Dependency injection for routes/services (if needed)
  // Example: attach mocks to req for downstream use
  if (aiService) {
    app.use((req, res, next) => {
      req.aiService = aiService;
      next();
    });
  }
  if (supabaseMock) {
    app.use((req, res, next) => {
      req.supabase = supabaseMock;
      next();
    });
  }

  // Register routes (import after DI if needed)
  // For now, import routes as usual (can be extended for DI)
  const recommendationsRoutes = require('../../src/routes/recommendations.routes');
  app.use('/recommendations', recommendationsRoutes);

  // Add other routes as needed (e.g., /ai, /plants, etc.)
  // ...

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  return app;
}

module.exports = createTestApp;
