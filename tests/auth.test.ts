import request from 'supertest';
import app from '../src/app';
import { getUrl } from '../src/utils';

export const login = async (email: string, password: string) => {
  const loginResponse = await request(app)
    .post(getUrl('/login'))
    .send({ name: email, password: password })
    .set('Accept', 'application/json');
  expect(loginResponse.status).toBe(200);
  return loginResponse.body.token;
}

describe('Authentication/Authorization tests', () => {
  let token: string | null = null;
  beforeAll(async () => {
    token = await login('jhon@email.com', 'password');
  });
  
  // Test the authentication system by checking if login and logout work as expected
  describe('Authentication', () => {
    it('returns 200 if login go well', async () => {
      await login('jhon@email.com', 'password');
    });
    it('returns 200 if logout go well', async () => {
      const res = await request(app)
        .post(getUrl('/logout'))
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  // Test the authorization system by checking if a token is required for protected endpoints
  describe('Authorization', () => {
    it('returns 401 if token is not provided for protected endpoints', async () => {
      const res = await request(app)
        .get(getUrl('/product'));
      expect(res.status).toBe(401);
    });
    it('returns 200 if token is provided for protected endpoints', async () => {
      const res = await request(app)
        .get(getUrl('/product'))
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
