import { PassportStatic } from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { Request } from 'express';
import UserModel, { IUserDB } from '../models/user';
import UnauthorizedError from '../errors/UnauthorizedError';
import {
  createUser,
  getUserById,
  getUserByUsername,
  isAuthTokenValid
} from '../services/user';
import { JWT_KEY } from '../config';
import UnauthenticatedError from '../errors/UnauthenticatedError';
import IToken from '../interfaces/IToken';

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

export const setupPassport = (passport: PassportStatic) => {
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findOne({ _id: id })
      .then(user => done(null, user))
      .catch(error => done(error));
  });

  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
      },
      async (
        req: Request,
        username: string,
        password: string,
        done: any
      ) => {
        try {
          const {
            confirmPassword,
            displayName,
            profile
          } = req.body;
          if (!confirmPassword) {
            throw new UnauthorizedError('Confirm password is required');
          } else if (confirmPassword !== password) {
            throw new UnauthorizedError('Confirm password does not match');
          }

          const userFound = await getUserByUsername(username);
          if (userFound) {
            throw new UnauthorizedError('Username is already in use');
          }

          const user: IUserDB | null = await createUser(
            {
              username,
              displayName,
              profile
            },
            password
          );
          if (!user) {
            throw new UnauthorizedError('Something went wrong');
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
      },
      async (
        _req: Request,
        username: string,
        password: string,
        done: any
      ) => {
        let user: IUserDB | null;
        try {
          user = await getUserByUsername(username);
          if (!user) {
            throw new UnauthorizedError('Wrong username or password');
          }

          const validate = await (user as any).isValidPassword(password);
          if (!validate) {
            throw new UnauthorizedError('Wrong username or password');
          }

          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JWTstrategy(
      {
        secretOrKey: JWT_KEY,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      async (token: IToken, done: any) => {
        try {
          let user;
          if (token.user && token.user.id) {
            user = await getUserById(token.user.id);
          }

          if (!user || !user.token) {
            throw new UnauthenticatedError('Unable to resolve user');
          }

          isAuthTokenValid(user.token);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
