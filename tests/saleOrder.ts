import request from 'supertest';
import IContext from '../src/interfaces/IContext';
import { getUrl } from '../src/utils';
import { saleOrders } from './utils/saleOrder';
import { TEST_USER_1 } from './utils/user';

const runTests = async (context: IContext) => {
  context.users = context.users || {};
  const results: Record<string, string>[] = [];
  const [
    saleOrder1,
    saleOrder2,
    saleOrder3
  ] = saleOrders;

  const user1SaleOrderRes1 = await request(context.app)
    .post(getUrl('/saleOrder'))
    .send(saleOrder1)
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1SaleOrderRes1.status).toBe(200);
  results.push({
    name: `SaleOrder ${saleOrder1.code} added successful with 200`,
    status: user1SaleOrderRes1.status === 200 ? 'passed' : 'failed'
  });

  const user1SaleOrderRes2 = await request(context.app)
    .post(getUrl('/saleOrder'))
    .send(saleOrder2).set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1SaleOrderRes2.status).toBe(400);
  results.push({
    name: `SaleOrder ${saleOrder2.code} should fail with 400 two product for the same type`,
    status: user1SaleOrderRes2.status === 400 ? 'passed' : 'failed'
  });

  const user1SaleOrderRes3 = await request(context.app)
    .post(getUrl('/saleOrder'))
    .send(saleOrder3)
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1SaleOrderRes3.status).toBe(400);
  results.push({
    name: `SaleOrder ${saleOrder3.code} should fail with 400 three products different types`,
    status: user1SaleOrderRes3.status === 400 ? 'passed' : 'failed'
  });

  return results;
};
export default runTests;
