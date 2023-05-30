/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env' });
}

import { start } from './app';
import { MONGO_URL } from './config';
import logger from './lib/logger';
import { verifyAndCreateAdmin } from './services/user';

export const startServer = async () => {
  try {
    logger.debug('Initializing server...');
    await start({
      mongo: {
        url: MONGO_URL
      }
    });
    await verifyAndCreateAdmin('admin');
  } catch (error) {
    logger.error('Fatal error in server: ', error);
    throw error;
  }
};

startServer();
