import request from 'supertest';
import IContext from '../src/interfaces/IContext';
import { getUrl } from '../src/utils';
import {
  TEST_USER_1,
  TEST_USER_2_ADMIN
} from './utils/user';

const runTests = async (context: IContext) => {
  context.users = context.users || {};
  // save the tests results
  const results: Record<string, string>[] = [];
  // Get the user from database
  const user1GetRes = await request(context.app)
    .get(getUrl('/user'))
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  context.users[TEST_USER_1.username] = {
    ...context.users[TEST_USER_1.username],
    ...user1GetRes.body.data
  };
  expect(user1GetRes.status).toBe(200);
  results.push({
    name: 'User1 "get" should success with 200 using user1 token',
    status: user1GetRes.status === 200 ? 'passed' : 'failed'
  });

  // Make a request to update user roles
  const user1UpdateRes = await request(context.app)
    .put(getUrl('/user', `${context.users[TEST_USER_1.username].id}/role`))
    .send({
      newRoles: ['user', 'editor']
    })
    .set('Authorization', `Bearer ${context.users.admin.token}`);
  expect(user1UpdateRes.status).toBe(200);
  results.push({
    name: 'User1 update roles should success with 200 admin granted',
    status: user1UpdateRes.status === 200 ? 'passed' : 'failed'
  });

  // Make a request to update user roles with non admin requester
  const user1UpdateRes2 = await request(context.app)
    .put(getUrl('/user', `${context.users[TEST_USER_1.username].id}/role`))
    .send({
      roles: ['user', 'editor']
    })
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1UpdateRes2.status).toBe(403);
  results.push({
    name: 'User1 update roles should fail with 403 non admin requester',
    status: user1UpdateRes2.status === 403 ? 'passed' : 'failed'
  });

  return results;
};

export default runTests;
