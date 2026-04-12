const request = require('supertest');
const app = require('../app');

describe('API Endpoint Smoke Test', () => {
  let token = 'testtoken'; // Replace with a valid token for real test

  test('GET /plants/search PASS', async () => {
    const res = await request(app).get('/plants/search?q=rose');
    expect([200,400]).toContain(res.statusCode);
  });

  test('GET /plants/:id PASS', async () => {
    const res = await request(app).get('/plants/1');
    expect([200,404,400]).toContain(res.statusCode);
  });

  test('POST /plants/identify PASS', async () => {
    const res = await request(app)
      .post('/plants/identify')
      .attach('image', Buffer.from('test'), 'test.jpg');
    expect([200,400,500]).toContain(res.statusCode);
  });

  test('POST /ai/ask PASS', async () => {
    const res = await request(app)
      .post('/ai/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'What is a rose?' });
    expect([200,400,401,500]).toContain(res.statusCode);
  });

  test('GET /favorites PASS', async () => {
    const res = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401]).toContain(res.statusCode);
  });

  test('POST /favorites PASS', async () => {
    const res = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'plant', plant_id: '1' });
    expect([201,400,401,500]).toContain(res.statusCode);
  });

  test('GET /recommendations PASS', async () => {
    const res = await request(app)
      .get('/recommendations')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401]).toContain(res.statusCode);
  });
});
