global.fetch = jest.fn();

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  aiApiCallCount = 0;
  fetch.mockImplementation(async () => {
    aiApiCallCount++;
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Mocked AI answer"
            }
          }
        ]
      })
    };
  });
  const aiService = require('../src/services/ai.service');
  if (aiService.cache) {
    aiService.cache.clear();
  }
});

const request = require('supertest');
const express = require('express');
const aiRoutes = require('../src/routes/ai.routes');
const supabase = require('../src/config/supabaseClient');
const aiService = require('../src/services/ai.service');

beforeEach(() => {
  jest.clearAllMocks();
  aiApiCallCount = 0;
  if (aiService.cache) {
    aiService.cache.clear();
  }
  supabase.auth = supabase.auth || {};
  supabase.auth.getUser = jest.fn(async (token) => ({ data: { user: { id: 'test-user' } }, error: null }));
  // Mock the real AI API call inside the service
  aiService.callRealAI = async () => {
    aiApiCallCount++;
    return { answer: 'Mocked response' };
  };
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

describe('AI response caching', () => {
  let aiApiCallCount = 0;
  beforeEach(() => {
    aiApiCallCount = 0;
    jest.clearAllMocks();
    // Mock supabase for ai_responses
    supabase.from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ maybeSingle: async () => ({ data: null, error: null }) }))
      })),
      insert: jest.fn(() => ({
        // Simulate insert
      }))
    }));
    // Mock AI API call
    aiService.__mockedAnswer = undefined;
    jest.spyOn(aiService, 'askQuestion').mockImplementation(async (question, userId) => {
      aiApiCallCount++;
      return 'Cached AI answer';
    });
  });

  it('should call AI API on first request and use cache on second', async () => {
    const question = 'What is photosynthesis?';
    aiApiCallCount = 0;
    // First request: should call API
    await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question });
    expect(aiApiCallCount).toBe(1);
    // Second request: should use cache
    await request(app)
      .post('/ai/ask')
      .set('Authorization', 'Bearer testtoken')
      .send({ question });
    expect(aiApiCallCount).toBe(1);
  });
});
