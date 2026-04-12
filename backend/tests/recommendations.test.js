const request = require('supertest');
const express = require('express');
const recommendationsRoutes = require('../src/routes/recommendations.routes');
const supabase = require('../src/config/supabaseClient');

const app = express();
app.use(express.json());
app.use('/recommendations', recommendationsRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Mock auth middleware
jest.mock('../src/middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 'test-user' };
  next();
});

describe('GET /recommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return recommendations for active user', async () => {
    // Mock user_activity and plants
    supabase.from = jest.fn((table) => {
      if (table === 'user_activity') {
        return {
          select: () => ({
            eq: () => ({
              in: () => ({
                order: () => ({
                  limit: () => ({ data: [
                    { activity_type: 'plant_view', reference_id: 'p1' },
                    { activity_type: 'search', query: 'rose' }
                  ], error: null })
                })
              })
            })
          })
        };
      }
      if (table === 'plants') {
        return {
          select: () => ({
            in: () => ({ limit: () => ({ data: [{ id: 'p1', common_name: 'Rose' }], error: null }) }),
            or: () => ({ limit: () => ({ data: [{ id: 'p2', common_name: 'Lily' }], error: null }) })
          })
        };
      }
      return {};
    });
    const res = await request(app).get('/recommendations');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should fallback for new user', async () => {
    supabase.from = jest.fn((table) => {
      if (table === 'user_activity') {
        return {
          select: () => ({
            eq: () => ({
              in: () => ({
                order: () => ({
                  limit: () => ({ data: [], error: null })
                })
              })
            })
          })
        };
      }
      if (table === 'plants') {
        return {
          select: () => ({
            order: () => ({ limit: () => ({ data: [{ id: 'p3', common_name: 'Cactus' }], error: null }) })
          })
        };
      }
      return {};
    });
    const res = await request(app).get('/recommendations');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should require authentication', async () => {
    // Remove auth mock for this test
    jest.resetModules();
    const realApp = express();
    realApp.use(express.json());
    // Use real (unmocked) middleware
    const realRoutes = require('../src/routes/recommendations.routes');
    realApp.use('/recommendations', realRoutes);
    realApp.use((err, req, res, next) => {
      res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });
    const res = await request(realApp).get('/recommendations');
    expect(res.statusCode).toBe(401);
  });
});
