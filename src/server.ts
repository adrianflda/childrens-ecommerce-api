/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env' });
}

import app from './app';
import logger from './lib/logger';

const PORT = process.env.PORT || 3000;

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);
});

serve();
