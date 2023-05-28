import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import { MONGO_URL } from '../config';

let mongooseConnection: typeof mongoose;

export function getConnection() {
  return mongooseConnection;
}

export default async function initDatabase(): Promise<Mongoose> {
  mongoose.Promise = Promise;
  const options = {
    // keepAlive: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  } as ConnectOptions;
  const connection = await mongoose.connect(MONGO_URL, options);
  // import after connection established
  await import('../models');

  mongooseConnection = connection;
  return connection;
};
