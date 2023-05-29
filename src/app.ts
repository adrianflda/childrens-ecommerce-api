import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import routes from './routes';
import { logResponseTime } from './lib/logger';
import './middleware/passport';
import initDatabase from './storage/mongo';
import { handleError } from './middleware/errorHandler';
import { verifyAndCreateAdmin } from './services/user';
import { JWT_KEY, MONGO_URL } from './config';

initDatabase();
verifyAndCreateAdmin();

const app = express();
// TODO setup origins
app.use(cors());

app.use(logResponseTime);

app.use(compression() as any);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.use(session({
  secret: JWT_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use(handleError);

export default app;
