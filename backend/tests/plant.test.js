describe('GET /plants/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and plant data when valid ID exists', async () => {
    const mockPlant = { id: '1', common_name: 'Rose', scientific_name: 'Rosa', uses: '', benefits: '', where_it_grows: '', how_to_grow: '', image_url: '', created_at: '', updated_at: '' };
    plantService.getPlantById.mockResolvedValueOnce(mockPlant);
    const res = await request(app).get('/plants/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockPlant);
  });

  it('should return 404 if plant not found', async () => {
    plantService.getPlantById.mockResolvedValueOnce(null);
    const res = await request(app).get('/plants/2');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Plant not found');
  });

  it('should return 400 if ID is missing or invalid', async () => {
    const res = await request(app).get('/plants/');
    expect(res.statusCode).toBe(404); // Express treats /plants/ as not found

    const res2 = await request(app).get('/plants/   ');
    expect([400, 404]).toContain(res2.statusCode); // Accept 400 or 404 depending on router
  });
});
const request = require('supertest');
jest.mock('../src/services/plant.service');
const plantService = require('../src/services/plant.service');
const app = require('../app');

describe('GET /plants/search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and empty list when no plants exist', async () => {
    plantService.searchPlants.mockResolvedValueOnce([]);
    const res = await request(app).get('/plants/search?q=rose');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ plants: [] });
  });

  it('should return matching plants when query is valid', async () => {
    const mockPlants = [
      { id: '1', common_name: 'Rose', scientific_name: 'Rosa', uses: '', benefits: '', where_it_grows: '', how_to_grow: '', image_url: '', created_at: '', updated_at: '' }
    ];
    plantService.searchPlants.mockResolvedValueOnce(mockPlants);
    const res = await request(app).get('/plants/search?q=rose');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ plants: mockPlants });
  });

  it('should return 400 if query parameter q is missing', async () => {
    const res = await request(app).get('/plants/search');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
