import express, { Application } from 'express';
import { Server } from 'http';
import path from 'path';
import IContext from './interfaces/IContext';
import IUser from './interfaces/IUser';
import logger from './lib/logger';
import { initMiddleware } from './middleware';
import { handleError } from './middleware/errorHandler';
import routes from './routes';
import { verifyAndCreateAdmin } from './services/user';
import { initDatabase } from './storage/mongo';

export const init = async (context: IContext) => {
  logger.debug('Setting up database...');
  await initDatabase(context.mongo);

  logger.debug('Setting up the middlewares');
  const app = express();
  app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
  );
  await initMiddleware(app);
  app.use(routes);
  app.use(handleError);
  return app;
};

export const start = async (context: IContext): Promise<IContext> => {
  try {
    const PORT = process.env.PORT || 3000;
    context.app = context.app || await init(context);
    context.server = context.app.listen(PORT, () => {
      logger.info(`🌏 Express server started at http://localhost:${PORT}`);
    });
  } catch (e: any) {
    logger.error(e.message);
  }
  return context;
};

export const stop = (server: Server): void => {
  try {
    server.close();
  } catch (e: any) {
    logger.error(e.message);
  }
};
