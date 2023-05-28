import passport from 'passport';
import { Response, Request, NextFunction } from 'express';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import { createAuthToken } from '../services/auth';
import { IUserDB } from '../models/user';
import UnauthorizedError from '../errors/UnauthorizedError';

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'login',
    async (err: { message: string | undefined; }, user: IUserDB, info: any) => {
      try {
        if (err) {
          throw new UnauthenticatedError(err.message);
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

export const signup = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'signup',
    async (err: { message: string | undefined; }, user: IUserDB) => {
      try {
        if (err) {
          throw new UnauthenticatedError(err.message);
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
