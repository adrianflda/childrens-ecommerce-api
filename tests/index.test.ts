import dotenv from 'dotenv';
import request from 'supertest';
import app from '../src/app';
import { verifyAndCreateAdmin } from '../src/services/user';
import { getUrl } from '../src/utils';
import { TEST_USER_2_ADMIN } from './data/user';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env' });
}

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

(async () => {
  await signup(
    TEST_USER_2_ADMIN.username,
    TEST_USER_2_ADMIN.password,
    TEST_USER_2_ADMIN.password
  );
})();
