

const request = require('supertest');
const supabase = require('../src/config/supabaseClient');
const createTestApp = require('./utils/createTestApp');

beforeEach(() => {
  jest.clearAllMocks();
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
                    limit: () => ({
                    data: [
                        { activity_type: 'plant_view', reference_id: 'p1' },
                        { activity_type: 'search', query: 'rose' }
                    ],
                    error: null
                    })
                })
                }),
                order: () => ({
                limit: () => ({
                    data: [
                    { activity_type: 'plant_view', reference_id: 'p1' }
                    ],
                    error: null
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
    const app = createTestApp();
    const res = await request(app)
      .get('/recommendations')
      .set('Authorization', 'Bearer testtoken');
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
    const app = createTestApp();
   const res = await request(app)
     .get('/recommendations')
     .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should require authentication', async () => {
    // Override auth middleware to simulate unauthenticated request
    const app = createTestApp({
      authMiddleware: (req, res) => res.status(401).json({ message: 'Unauthorized' })
    });
    const res = await request(app)
     .get('/recommendations')
     .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(401);
  });
});
