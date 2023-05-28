import jwt from 'jsonwebtoken';
import UserModel, { IUserDB } from '../models/user';
import { getUserByUsername } from './user';
import UnauthorizedError from '../errors/UnauthorizedError';
import { JWT_KEY, JWT_DURATION } from '../config';

const jwtDuration: string = JWT_DURATION;

const jwtKey: string = JWT_KEY;

if (jwtKey === 'secret-key') {
  // throw new Error('The JWT_KEY is required');
}

/**
    *
    * @param user User to be created
    * @returns The new token
    */
export const createAuthToken = (
  user: IUserDB
): string => jwt.sign(
  {
    user: {
      _id: user._id,
      username: user.username
    }
  },
  jwtKey,
  {
    expiresIn: jwtDuration
  }
);

/**
    *
    * @param jwtToken The token to be validate
    * @returns True or False if valid
    */
export const isAuthTokenValid = (
  jwtToken: string
): boolean => {
  try {
    return !!jwt.verify(jwtToken, jwtKey);
  } catch (error) {
    return false;
  }
};

/**
    *
    * @param jwtToken The token to find an user
    * @returns The user found or null
    */
export const getUserForAuthToken = async (
  jwtToken: string
): Promise<IUserDB | null> => {
  const payload: any = jwt.verify(jwtToken, jwtKey);
  if (payload) {
    return UserModel.findById(payload.id);
  }
  return null;
};

/**
    *
    * @param username The username
    * @param password The user password
    * @returns The authenticated user or null
    */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<IUserDB | null> => {
  const user: IUserDB | null = await getUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError('Wrong username or password');
  }

  const validate = await (user as any).validatePassword(password);
  if (!validate) {
    throw new Error('Wrong Password');
  }

  return user;
};
