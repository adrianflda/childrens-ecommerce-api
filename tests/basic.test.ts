import request from 'supertest';
import app from '../src/app';
import { API_VERSION } from '../src/config';

describe('Basic App Tests', () => {
  test('GET /info should return info', done => {
    request(app).get('/api/info')
      .expect(200, done);
  });
  test('GET /random-url should return 404', done => {
    request(app).get(`/api/${API_VERSION}/reset`)
      .expect(404, done);
  });
});
