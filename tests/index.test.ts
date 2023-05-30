import request from 'supertest';
import { init, start } from '../src/app';
import IContext from '../src/interfaces/IContext';
import IUser from '../src/interfaces/IUser';
import logger from '../src/lib/logger';
import { verifyAndCreateAdmin } from '../src/services/user';
import { clearDatabase, disconnect } from '../src/storage/mongo';
import authTests from './auth';
import userTests from './user';

const context: IContext = {
  env: 'test',
  mongo: {
    url: 'mongodb://localhost:27017/test'
  },
  users: {

  }
};

describe('General test suite', () => {
  beforeAll(async () => {
    logger.info('>>>> Launching server');
    if (!context.app) {
      // start the app
      await start(context);
      // clear the previous database
      await clearDatabase();

      logger.debug('Initializing admin user');
      const adminUser = await verifyAndCreateAdmin('admin');
      // update context on test environment
      if (context.env === 'test' && context.users) {
        context.users.admin = adminUser as IUser;
      }
    }
  });

  afterAll(async () => {
    if (context.server) {
      context.server.close();
    }
    await disconnect();
  });

  test('Server running', async () => {
    const resp = await request(context.app)
      .get('/');
    expect(resp.status).toStrictEqual(200);
  });

  test('Auth test suite', async () => {
    const authResults = await authTests(context);
    expect(authResults).toEqual([
      {
        name: 'Admin login should success with 200',
        status: 'passed'
      },
      {
        name: 'The signup should fail with 401, username already in use',
        status: 'passed'
      },
      {
        name: 'User1 should login successful with 200',
        status: 'passed'
      },
      {
        name: 'User1 signup should fail with 401 confirm password does not match',
        status: 'passed'
      },
      {
        name: 'User1 login should fail with 401 wrong username or password',
        status: 'passed'
      },
      {
        name: 'User1 "get" should fail with 401 token does not provided',
        status: 'passed'
      },
      {
        name: 'User1 "get" should success with 200 token provided',
        status: 'passed'
      }
    ]);
  });

  test('User test suite', async () => {
    const userResults = await userTests(context);
    expect(userResults).toEqual([
      {
        name: 'User1 "get" should success with 200 using user1 token',
        status: 'passed'
      },
      {
        name: 'User1 update roles should success with 200 admin granted',
        status: 'passed'
      },
      {
        name: 'User1 update roles should fail with 401 non admin requester',
        status: 'passed'
      }
    ]);
  });
});
