const request = require('supertest');
const express = require('express');
const aiRoutes = require('../src/routes/ai.routes');
const supabase = require('../src/config/supabaseClient');
const aiService = require('../src/services/ai.service');

beforeEach(() => {
  jest.clearAllMocks();
  supabase.auth = supabase.auth || {};
  supabase.auth.getUser = jest.fn(async (token) => ({ data: { user: { id: 'test-user' } }, error: null }));
  jest.spyOn(aiService, 'askQuestion').mockImplementation(async (question) => 'This is a mock AI answer.');
});

// Main app with real auth middleware
const app = express();
app.use(express.json());
app.use('/ai', aiRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

describe('POST /ai/ask', () => {
  it('should return 200 and answer for valid question', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question: 'How do I care for a rose plant?' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('answer');
    expect(typeof res.body.answer).toBe('string');
  });

  it('should return 400 if question is missing', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 if question is empty', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 401 if unauthorized', async () => {
    // Use real route, but do not set Authorization header
    const res = await request(app)
      .post('/ai/ask')
      .send({ question: 'How do I care for a rose plant?' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
