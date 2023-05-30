import {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from 'express';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import IUser from '../interfaces/IUser';
import { IUserDB } from '../models/user';
import { updateUserRoles } from '../services/user';

export const externalizeUser = (user: IUserDB | null): IUser | null => {
  if (!user) {
    return null;
  }
  const {
    _id,
    token,
    password,
    ...externalizedUser
  } = user.toJSON() as any;

  externalizedUser.id = _id;
  return externalizedUser;
};

export const updateUserRolesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newRoles } = req.body;
    const { userId } = req.params;

    const newUser = await updateUserRoles(userId, newRoles);

    return res.json({
      message: 'Successful user role updated',
      data: externalizeUser(newUser as IUserDB)
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserController : RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    if (!user) {
      throw new UnauthenticatedError('You must be logged in');
    }

    return res.json({
      message: 'Successful user get',
      data: externalizeUser(user as IUserDB)
    });
  } catch (error) {
    return next(error);
  }
};
