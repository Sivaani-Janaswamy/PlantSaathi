// ✅ MUST BE FIRST: mock BEFORE imports
jest.mock('../src/services/ai.service', () => {
  let cache = {};

  return {
    askQuestion: jest.fn(async (question, userId) => {
      if (cache[question]) {
        return cache[question]; // return cached
      }
      const response = `Mocked answer for: ${question}`;
      cache[question] = response;
      return response;
    }),
    __clearCache: () => {
      cache = {};
    }
  };
});

const request = require('supertest');
const express = require('express');
const aiRoutes = require('../src/routes/ai.routes');
const supabase = require('../src/config/supabaseClient');
const aiService = require('../src/services/ai.service');

// Setup app
const app = express();
app.use(express.json());
app.use('/ai', aiRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Common setup
beforeEach(() => {
  jest.clearAllMocks();

  // mock auth
  supabase.auth = supabase.auth || {};
  supabase.auth.getUser = jest.fn(async () => ({
    data: { user: { id: 'test-user' } },
    error: null
  }));

  // clear mock cache
  if (aiService.__clearCache) {
    aiService.__clearCache();
  }
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
  });

  it('should return 400 if question is empty', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question: '' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 if unauthorized', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .send({ question: 'How do I care for a rose plant?' });

    expect(res.statusCode).toBe(401);
  });
});

describe('AI response caching', () => {
  it('should call AI once and use cache second time', async () => {
    const question = 'What is photosynthesis?';

    await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question });

    await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question });

    // ✅ since askQuestion is mocked, check call count
    expect(aiService.askQuestion).toHaveBeenCalledTimes(1);
  });
});