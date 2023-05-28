import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { Request } from 'express';
import { IUserDB } from '../models/user';
import UnauthorizedError from '../errors/UnauthorizedError';
import { createUser, getUserByUsername } from '../services/user';
import { JWT_KEY } from '../config';

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    async (req: Request, username: string, password: string, done: any) => {
      try {
        const { confirmPassword } = req.body;
        if (!confirmPassword) {
          throw new UnauthorizedError('Confirm password is required');
        } else if (confirmPassword !== password) {
          throw new UnauthorizedError('Confirm password does not match');
        }

        const userFound = await getUserByUsername(username);
        if (userFound) {
          throw new UnauthorizedError('Username is already in use');
        }

        const user: IUserDB | null = await createUser(username, password);
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
    async (req: Request, username: string, password: string, done: any) => {
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
      } finally {
        // TODO create session
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
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
