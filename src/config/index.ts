export const {
  API_VERSION,
  MONGO_URL = 'mongodb://127.0.0.1:27017/ecommerce',
  JWT_KEY = 'secret-key',
  JWT_DURATION = '30m',
  SESSION_KEY = 'session-secret',
  COOKIES_KEY
} = process.env;

export const BASE_URL = `/api/${API_VERSION}`;

export const SALT_FACTOR = 10;
