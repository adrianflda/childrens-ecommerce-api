import bodyParser from 'body-parser';
import express, {
  Application
} from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import passport from 'passport';
import { logRequestsDetailed } from '../lib/logger';
import { SESSION_KEY } from '../config';
import { setupPassport } from './passport';

export const initMiddleware = async (app: Application) => {
  let store;

  app.use(logRequestsDetailed);

  app.use(cors());

  // initialize passport
  setupPassport(passport);

  app.use(session({
    store,
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // must be coming via HTTPS when true
      secure: false
    }
  }));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // compress all responses
  app.use(compression());

  app.use(passport.initialize());
  app.use(passport.session());
};
