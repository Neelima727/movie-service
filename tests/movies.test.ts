import request from 'supertest';
import app from '../movies_api/index';

describe('Movies API', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome to the movie API');
  });

  it('should list all movies (paginated)', async () => {
    const res = await request(app).get('/movies/all?page=1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('movies');
    expect(Array.isArray(res.body.movies)).toBe(true);
  });

  it('should get movie details by movieId', async () => {
    // Replace 1 with a valid movieId from your database
    const res = await request(app).get('/movies/1');
    expect([200,404]).toContain(res.statusCode);
  });

  it('should list movies by year', async () => {
    const res = await request(app).get('/movies/year/2000?page=1');
    expect([200,404]).toContain(res.statusCode);
  });

  it('should list movies by genre', async () => {
    const res = await request(app).get('/movies/genre/Drama?page=1');
    expect([200,404]).toContain(res.statusCode);
  });
});
