import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import UserModel, { IUserDB } from '../models/user';
import { JWT_KEY, JWT_DURATION } from '../config';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import BadRequest from '../errors/BadRequest';
import { externalizeUser } from '../controllers/user';
import IUser from '../interfaces/IUser';

const jwtDuration: string = JWT_DURATION;

const jwtKey: string = JWT_KEY;

if (jwtKey === 'secret-key') {
  // throw new Error('The JWT_KEY is required');
}

/**
    *
    * @param username String
    * @param options Object
    * @returns An user if found or null
    */
export const getUserByUsername = async (
  username: string,
  options: any = {}
): Promise<IUserDB | null> => {
  let promise = UserModel.findOne({ username });

  if (options.populate) {
    promise = promise.populate([
      {
        path: 'profile',
        populate: {
          path: 'profile'
        }
      }
    ]);
  }

  if (options.lean) {
    promise = promise.lean();
  }

  return promise;
};

/**
    *
    * @param username String
    * @param options Object
    * @returns An user if found or null
    */
export const getUserById = (
  userId: ObjectId,
  options: any = {}
): Promise<IUserDB | null> => {
  let promise = UserModel.findOne({ _id: userId });

  if (options.populate) {
    promise = promise.populate([
      {
        path: 'profile',
        populate: {
          path: 'profile'
        }
      }
    ]);
  }

  if (options.lean) {
    promise = promise.lean();
  }

  return promise;
};

/**
    *
    * @param username Username for the new user
    * @param password Password for the new user
    * @param displayName String Display name for the new user
    * @returns The new created user
    */
export const createUser = (
  user: IUser,
  password: string
): Promise<IUserDB | null> => {
  const newUser: Record<string, any> = {
    username: user.username.toLowerCase(),
    password,
    displayName: user.displayName,
    roles: user.roles,
    profile: user.profile
  };
  return UserModel.create(newUser);
};

/**
    *
    * @param user User to be created
    * @returns The new token
    */
export const createAuthToken = async (
  user: IUserDB
): Promise<string> => {
  const token = jwt.sign(
    {
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles
      }
    },
    jwtKey,
    {
      expiresIn: jwtDuration
    }
  );

  await UserModel.updateOne({ _id: user._id }, { token });
  return token;
};

export const removeAuthToken = async (user: IUserDB): Promise<void> => {
  await UserModel.updateOne({ _id: user._id }, { token: '' });
};

/**
    *
    * @param jwtToken The token to be validate
    * @returns True or False if valid
    */
export const isAuthTokenValid = (
  jwtToken: string
): boolean => {
  if (!jwtToken) {
    throw new UnauthenticatedError('No valid temporary access token found');
  }

  const decodedToken = jwt.verify(jwtToken, jwtKey) as jwt.JwtPayload;
  if (!decodedToken) {
    throw new UnauthenticatedError('No valid temporary access token found');
  }
  if (!decodedToken.exp) {
    throw new UnauthenticatedError('No valid temporary access token found');
  }

  const today = Date.now() / 1000;
  if (today > decodedToken.exp) {
    throw new UnauthenticatedError('Expired temporary access token');
  }
  return true;
};

/**
    *
    * @param jwtToken The token to find an user
    * @returns The user found or null
    */
export const getUserForAuthToken = async (
  jwtToken: string
): Promise<IUserDB | null> => UserModel.findOne({ token: jwtToken });

export const updateUserRoles = async (userId: string, newRoles: string[]) => {
  if (!userId.trim()) {
    throw new BadRequest('userId is required and well formed');
  }
  if (!Array.isArray(newRoles)) {
    throw new BadRequest('roles must be an array');
  }
  return UserModel.findByIdAndUpdate({ _id: userId }, { roles: newRoles });
};

/**
 *
 * @param username User name for the new admin to be created
 * @returns The created user or null if already exist
 */
export const verifyAndCreateAdmin = async (username?: string): Promise<IUser | null> => {
  const newUsername = username || 'admin';
  let userFound: IUserDB | null = await UserModel.findOne({ username: newUsername });
  if (!userFound) {
    userFound = await createUser(
      {
        username: newUsername,
        displayName: newUsername,
        roles: ['user', 'admin']
      },
      newUsername
    );
  }
  return externalizeUser(userFound);
};
