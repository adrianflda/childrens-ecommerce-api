import request from 'supertest';
import { init, start } from '../src/app';
import IContext from '../src/interfaces/IContext';
import IUser from '../src/interfaces/IUser';
import logger from '../src/lib/logger';
import { verifyAndCreateAdmin } from '../src/services/user';
import { clearDatabase, disconnect } from '../src/storage/mongo';
import errorTests from './error';
import authTests from './auth';
import userTests from './user';
import productTests from './product';
import saleOrderTests from './saleOrder';
import { API_VERSION } from '../src/config';
import { products } from './utils/product';
import { saleOrders } from './utils/saleOrder';

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

  test('Basic test suite', async () => {
    await request(context.app)
      .get('/api/info')
      .expect(200);

    await request(context.app)
      .get(`/api/${API_VERSION}/reset`)
      .expect(404);
  });

  test('Error test suite', async () => {
    const errorResults = await errorTests();
    expect(errorResults).toEqual([
      {
        name: 'sets default error message',
        status: 'passed'
      },
      {
        name: 'sets correct message',
        status: 'passed'
      },
      {
        name: 'sets 500 as default status code',
        status: 'passed'
      },
      {
        name: 'sets correct status',
        status: 'passed'
      }
    ]);
  });

  test('Auth test suite', async () => {
    const authResults = await authTests(context);
    expect(authResults).toEqual([
      {
        name: 'Admin login should success with 200',
        status: 'passed'
      },
      {
        name: 'The signup should fail with 403, username already in use',
        status: 'passed'
      },
      {
        name: 'User1 should login successful with 200',
        status: 'passed'
      },
      {
        name: 'User1 signup should fail with 403 confirm password does not match',
        status: 'passed'
      },
      {
        name: 'User1 login should fail with 403 wrong username or password',
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
        name: 'User1 update roles should fail with 403 non admin requester',
        status: 'passed'
      }
    ]);
  });

  test('Product test suite', async () => {
    const productResults = await productTests(context);
    const expectedResults = products.map(product => ({
      name: `Product ${product.name} added successful with 200 by admin`,
      status: 'passed'
    }));
    expect(productResults).toEqual([
      {
        name: 'Product add should fail with 403 unauthorized',
        status: 'passed'
      },
      ...expectedResults,
      {
        name: 'Product update should fail with 403 unauthorized',
        status: 'passed'
      }
    ]);
  });

  test('SaleOrder test suite', async () => {
    const saleOrderResults = await saleOrderTests(context);
    const expectedResults = saleOrders.map(saleOrder => ({
      name: `SaleOrder ${saleOrder.code} added successful with 200 by admin`,
      status: 'passed'
    }));
    expect(saleOrderResults).toEqual([
      {
        name: 'SaleOrder add should fail with 401 unauthenticated',
        status: 'passed'
      },
      ...expectedResults
    ]);
  });
});
