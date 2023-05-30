import request from 'supertest';
import IContext from '../src/interfaces/IContext';
import { getUrl } from '../src/utils';
import { products } from './utils/product';
import { TEST_USER_1 } from './utils/user';

const runTests = async (context: IContext) => {
  context.users = context.users || {};
  const results: Record<string, string>[] = [];
  const [
    product1,
    ...theRestOfProducts
  ] = products;

  const user1ProductRes = await request(context.app)
    .post(getUrl('/product'))
    .send(product1)
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1ProductRes.status).toBe(403);
  results.push({
    name: 'Product add should fail with 403 unauthorized',
    status: user1ProductRes.status === 403 ? 'passed' : 'failed'
  });

  for (const product of products) {
    const adminProductRes = await request(context.app)
      .post(getUrl('/product'))
      .send(product)
      .set('Authorization', `Bearer ${context.users.admin.token}`);
    expect(adminProductRes.status).toBe(200);
    results.push({
      name: `Product ${product.name} added successful with 200 by admin`,
      status: adminProductRes.status === 200 ? 'passed' : 'failed'
    });
  }

  const user1ProductRes2 = await request(context.app)
    .put(getUrl('/product', product1.id))
    .send(product1)
    .set('Authorization', `Bearer ${context.users[TEST_USER_1.username].token}`);
  expect(user1ProductRes2.status).toBe(403);
  results.push({
    name: 'Product update should fail with 403 unauthorized',
    status: user1ProductRes2.status === 403 ? 'passed' : 'failed'
  });

  return results;
};
export default runTests;
