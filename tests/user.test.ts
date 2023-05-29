import request from 'supertest';
import app from '../src/app';
import { getUrl } from '../src/utils';
import { TEST_USER_1, TEST_USER_2_ADMIN } from './data/user';

export const login = async (
  username: string,
  password: string
) => request(app)
  .post(getUrl('/auth/login'))
  .send({ username, password })
  .set('Accept', 'application/json');

describe('User CRUD suite tests', () => {
  let token: string | null = null;
  let adminToken: string | null = null;
  beforeAll(async () => {
    const res = await login(TEST_USER_1.username, TEST_USER_1.password);
    token = res.body.token;
    const adminRes = await login(TEST_USER_2_ADMIN.username, TEST_USER_2_ADMIN.password);
    adminToken = adminRes.body.token;
  });

  // Test the user creation by checking
  describe('User roles update tests', () => {
    it('returns 200 if user roles update go well', async () => {
      const res = await request(app)
        .put(getUrl('/user', 'userId'))
        .send({
          roles: ['user', 'editor']
        })
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
    it('returns 401 if executor is not allowed to update user', async () => {
      const res = await request(app)
        .put(getUrl('/user', 'userId'))
        .send({
          roles: ['user', 'editor']
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
    });
  });
});
