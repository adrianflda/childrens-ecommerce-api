import request from 'supertest';
import app from '../src/app';
import { getUrl } from '../src/utils';
import { TEST_USER_1 } from './data/user';

export const signup = async (
  username: string,
  password: string,
  confirmPassword: string
) => request(app)
  .post(getUrl('/auth/signup'))
  .send({ username, password, confirmPassword })
  .set('Accept', 'application/json');

export const login = async (
  username: string,
  password: string
) => request(app)
  .post(getUrl('/auth/login'))
  .send({ username, password })
  .set('Accept', 'application/json');

describe('Authentication/Authorization tests', () => {
  let token: string | null = null;
  beforeAll(async () => {
    await signup(TEST_USER_1.username, TEST_USER_1.password, TEST_USER_1.password);
    const res = await login(TEST_USER_1.username, TEST_USER_1.password);
    token = res.body.token;
  });

  // Test the authentication system by checking if login and logout work as expected
  describe('Authentication', () => {
    it('returns 401 username already in use', async () => {
      const res = await signup(TEST_USER_1.username, 'password', 'password');
      expect(res.status).toBe(401);
    });
    it('returns 401 confirm password does not match', async () => {
      const res = await signup(TEST_USER_1.username, 'password', '1234567');
      expect(res.status).toBe(401);
    });
    it('returns 401 wrong username or password', async () => {
      const res = await login(TEST_USER_1.username, 'wrongPassword');
      expect(res.status).toBe(401);
    });
    it('returns 200 if logout go well', async () => {
      const res = await request(app)
        .post(getUrl('/auth/logout'))
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
