const request = require('supertest');
const supabase = require('../src/config/supabaseClient');
jest.mock('../src/config/supabaseClient');

beforeEach(() => {
  jest.clearAllMocks();
  supabase.auth.getUser = jest.fn(async (token) => ({ data: { user: { id: 'test-user' } }, error: null }));
  supabase.from = jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({ data: [], error: null })),
      in: jest.fn(() => ({ data: [], error: null })),
      order: jest.fn(() => ({ data: [], error: null }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({ data: {}, error: null }))
      }))
    }))
  }));
});

const favoriteService = require('../src/services/favorite.service');
const express = require('express');
const favoriteRoutes = require('../src/routes/favorite.routes');

// Main app with auth: inject req.user for authorized tests
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = { id: 'test-user' };
  next();
});
app.use('/favorites', favoriteRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

describe('POST /favorites', () => {
  it('should create plant favorite (201)', async () => {
    const res = await request(app)
      .post('/favorites')
      .set('Authorization', 'Bearer testtoken')
      .send({ type: 'plant', plant_id: 'plant-1' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({}); // supabase mock returns {}
  });

  it('should create AI favorite (201)', async () => {
    const res = await request(app)
      .post('/favorites')
      .set('Authorization', 'Bearer testtoken')
      .send({ type: 'ai', text: 'hello' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({}); // supabase mock returns {}
  });

  it('should fail for invalid input (400)', async () => {
    const res = await request(app)
      .post('/favorites')
      .set('Authorization', 'Bearer testtoken')
      .send({ type: 'plant' }); // missing plant_id
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should fail if unauthorized (401)', async () => {
    // App without auth: mount controller directly
    const appNoAuth = express();
    appNoAuth.use(express.json());
    const controller = require('../src/controllers/favorite.controller');
    appNoAuth.post('/favorites', controller.addFavorite);
    appNoAuth.use((err, req, res, next) => {
      res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });
    const res = await request(appNoAuth)
      .post('/favorites')
      .send({ type: 'plant', plant_id: 'plant-1' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});

describe('GET /favorites', () => {
  it('should return user favorites (200)', async () => {
    const res = await request(app)
      .get('/favorites')
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ favorites: [] }); // supabase mock returns []
  });

  it('should return empty list if none', async () => {
    const res = await request(app)
      .get('/favorites')
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ favorites: [] });
  });

  it('should fail if unauthorized (401)', async () => {
    // App without auth: mount controller directly
    const appNoAuth = express();
    appNoAuth.use(express.json());
    const controller = require('../src/controllers/favorite.controller');
    appNoAuth.get('/favorites', controller.getFavorites);
    appNoAuth.use((err, req, res, next) => {
      res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });
    const res = await request(appNoAuth).get('/favorites');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
