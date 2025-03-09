import request from 'supertest';
import { app } from '../../server.js';

describe('Auth Controller', () => {
  it('Debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
