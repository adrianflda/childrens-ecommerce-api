import passport from 'passport';
import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import { createAuthToken, removeAuthToken } from '../services/user';
import { IUserDB } from '../models/user';
import UnauthorizedError from '../errors/UnauthorizedError';
import requestMiddleware from '../middleware/requestMiddleware';

export const signupValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'username must be string',
      'string.alphanum': 'username must be alpha-numeric (a..z 1..2)',
      'string.min': 'username length must be at least 3 characters long',
      'string.max': 'username length must be less than 10 characters long',
      'any.required': 'username is a required field'
    }),

  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),

  confirmPassword: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
});
const signup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'signup',
    async (
      err: { message: string | undefined; },
      user: IUserDB
    ) => {
      try {
        if (err) {
          throw new UnauthorizedError(err.message);
        }

        if (!user) {
          throw new UnauthorizedError('Wrong username or password');
        }

        return req.login(
          user,
          { session: false },
          async (error: any) => {
            if (error) {
              return next(error);
            }

            const token = await createAuthToken(user);
            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};
export const signupController = requestMiddleware(
  signup,
  {
    validation: {
      body: signupValidation
    }
  }
);

export const loginValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
});
const login = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'login',
    async (
      err: { message: string | undefined; },
      user: IUserDB
    ) => {
      try {
        if (err) {
          throw new UnauthorizedError(err.message);
        }

        if (!user) {
          throw new UnauthorizedError('Wrong username or password');
        }

        return req.login(
          user,
          { session: false },
          async (error: any) => {
            if (error) {
              return next(error);
            }

            const token = await createAuthToken(user);
            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};
export const loginController = requestMiddleware(
  login,
  {
    validation: {
      body: loginValidation
    }
  }
);

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    return req.logout(
      {},
      async (error: any) => {
        if (error) {
          return next(error);
        }
        await removeAuthToken(user as IUserDB);
        return res.json({ message: 'Bye :(' });
      }
    );
  } catch (error) {
    return next(error);
  }
};
