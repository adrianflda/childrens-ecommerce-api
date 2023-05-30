import { Request, Response, NextFunction } from 'express';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import UnauthorizedError from '../errors/UnauthorizedError';
import logger from '../lib/logger';
import { IUserDB } from '../models/user';
import IAplicationError from '../interfaces/IAplicationError';

export const handleError = (
  error: IAplicationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { message, status = 500 } = error;

  if (error instanceof UnauthorizedError) {
    status = 403;
    message = message || 'You are not authorized';
  }

  if (error instanceof UnauthenticatedError) {
    status = 401;
    message = message || 'Authentication required';
  }

  logger.debug(`request Body: ${JSON.stringify(req.body, undefined, 2)}`);
  if (req.user) {
    logger.info(`user: ${(req.user as IUserDB).username}`);
  }
  logger.error(`Error ${status} - `, error);

  res.status(status).json({
    status,
    message
  });
};
