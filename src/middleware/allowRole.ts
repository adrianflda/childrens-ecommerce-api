import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/UnauthorizedError';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import IUser from '../interfaces/IUser';

/**
   * This works on a 'one of' principal. The user being checked
   * should have one of the roles (or the role) specified as parameter.
   *
   * @param roles
   */
const allowRole = (
  roles: string | string[]
) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser = req.user as IUser;
    if (!user) {
      throw new UnauthenticatedError('Unknown user');
    }

    const userRoles = user.roles || [];

    roles = Array.isArray(roles) ? roles : [roles];

    const hasRole = !!roles.find(role => userRoles.includes(role));

    if (!hasRole) {
      throw new UnauthorizedError('You don\'t have enough permissions');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default allowRole;
