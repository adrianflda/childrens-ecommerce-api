import { Application } from 'express';
import request from 'supertest';
import { API_VERSION } from '../src/config';

const runTests = ({ app }: { app: Application }) => {
  describe('Basic App Tests', () => {
    test('GET /info should return info', async () => {
      request(app).get('/api/info')
        .expect(200);
    });
    test('GET /random-url should return 404', async () => {
      request(app).get(`/api/${API_VERSION}/reset`)
        .expect(404);
    });
  });
};
export default runTests;
