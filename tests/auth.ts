import request from 'supertest';
import IContext from '../src/interfaces/IContext';
import IUser from '../src/interfaces/IUser';
import logger from '../src/lib/logger';
import { getUrl } from '../src/utils';
import { signup, login } from './utils/tools';
import {
  TEST_USER_1,
  TEST_USER_2_ADMIN,
  TEST_USER_3_USER,
  TEST_USER_4_ADMIN
} from './utils/user';

const runTests = async (context: IContext) => {
  context.users = context.users || {};
  const { body: { token: token1 } } = await signup(
    context,
    TEST_USER_1.username,
    TEST_USER_1.password,
    TEST_USER_1.password
  );
  context.users[TEST_USER_1.username] = {
    ...TEST_USER_1,
    token: token1
  };
  const { body: { token: token2 } } = await signup(
    context,
    TEST_USER_2_ADMIN.username,
    TEST_USER_2_ADMIN.password,
    TEST_USER_2_ADMIN.password
  );
  context.users[TEST_USER_2_ADMIN.username] = {
    ...TEST_USER_2_ADMIN,
    token: token2
  };
  const { body: { token: token3 } } = await signup(
    context,
    TEST_USER_3_USER.username,
    TEST_USER_3_USER.password,
    TEST_USER_3_USER.password
  );
  context.users[TEST_USER_3_USER.username] = {
    ...TEST_USER_3_USER,
    token: token3
  };
  const { body: { token: token4 } } = await signup(
    context,
    TEST_USER_4_ADMIN.username,
    TEST_USER_4_ADMIN.password,
    TEST_USER_4_ADMIN.password
  );
  context.users[TEST_USER_4_ADMIN.username] = {
    ...TEST_USER_4_ADMIN,
    token: token4
  };

  // begin the tests
  const results: Record<string, string>[] = [];

  // Make a request login with admin
  const adminLoginRes = await login(
    context,
    'admin',
    'admin'
  );
  context.users.admin.token = adminLoginRes.body.token;
  expect(adminLoginRes.status).toBe(200);
  results.push({
    name: 'Admin login should success with 200',
    status: adminLoginRes.status === 200 ? 'passed' : 'failed'
  });

  // Make a request to the auth endpoint with an existing user
  const user1SignupRes = await signup(
    context,
    TEST_USER_1.username,
    'password',
    'password'
  );
  expect(user1SignupRes.status).toBe(401);
  results.push({
    name: 'The signup should fail with 401, username already in use',
    status: user1SignupRes.status === 401 ? 'passed' : 'failed'
  });

  // Make a request to login with an existing user
  const user1LoginRes = await login(
    context,
    TEST_USER_1.username,
    TEST_USER_1.password
  );
  const { token } = user1LoginRes.body;
  context.users[TEST_USER_1.username].token = token;
  expect(user1LoginRes.status).toBe(200);
  results.push({
    name: 'User1 should login successful with 200',
    status: user1LoginRes.status === 200 ? 'passed' : 'failed'
  });

  // Make a request with wrong confirm password
  const user1SignupRes2 = await signup(
    context,
    TEST_USER_1.username,
    'password',
    '1234567'
  );
  expect(user1SignupRes2.status).toBe(401);
  results.push({
    name: 'User1 signup should fail with 401 confirm password does not match',
    status: user1SignupRes2.status === 401 ? 'passed' : 'failed'
  });

  // Make a request with wrong password
  const user1LoginRes2 = await login(
    context,
    TEST_USER_1.username,
    'wrongPassword'
  );
  expect(user1LoginRes2.status).toBe(401);
  results.push({
    name: 'User1 login should fail with 401 wrong username or password',
    status: user1SignupRes2.status === 401 ? 'passed' : 'failed'
  });

  // Make a request without token
  const user1GetRes = await request(context.app)
    .get(getUrl('/user'));
  expect(user1GetRes.status).toBe(401);
  results.push({
    name: 'User1 "get" should fail with 401 token does not provided',
    status: user1GetRes.status === 401 ? 'passed' : 'failed'
  });

  // Make a request with token
  const user1GetRes2 = await request(context.app)
    .get(getUrl('/user'))
    .set('Authorization', `Bearer ${token}`);
  expect(user1GetRes2.status).toBe(200);
  results.push({
    name: 'User1 "get" should success with 200 token provided',
    status: user1GetRes2.status === 200 ? 'passed' : 'failed'
  });

  return results;
};

export default runTests;
