import UserModel, { IUserDB } from '../models/user';

/**
    *
    * @param username String
    * @param options Object
    * @returns An user if found or null
    */
export const getUserByUsername = (
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
    * @param username Username for the new user
    * @param password Password for the new user
    * @param displayName String Display name for the new user
    * @returns The new created user
    */
export const createUser = (
  username: string,
  password: string,
  displayName?: string
): Promise<IUserDB | null> => {
  const user: Record<string, any> = {
    username: username.toLowerCase(),
    password,
    displayName
  };
  return UserModel.create(user);
};
