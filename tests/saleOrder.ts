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
    ...theRestOfSaleOrders
  ] = saleOrders;

  const user1SaleOrderRes = await request(context.app)
    .post(getUrl('/saleOrder'))
    .send(saleOrder1);
  expect(user1SaleOrderRes.status).toBe(401);
  results.push({
    name: 'SaleOrder add should fail with 401 unauthenticated',
    status: user1SaleOrderRes.status === 401 ? 'passed' : 'failed'
  });

  for (const saleOrder of saleOrders) {
    const adminSaleOrderRes = await request(context.app)
      .post(getUrl('/saleOrder'))
      .send(saleOrder)
      .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
    expect(adminSaleOrderRes.status).toBe(200);
    results.push({
      name: `SaleOrder ${saleOrder.code} added successful with 200 by admin`,
      status: adminSaleOrderRes.status === 200 ? 'passed' : 'failed'
    });
  }

  return results;
};
export default runTests;
