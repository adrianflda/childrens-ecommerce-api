import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import { MONGO_URL } from '../config';
import logger from '../lib/logger';

let mongooseConnection: typeof mongoose;

export const getConnection = () => mongooseConnection;

export const initDatabase = async (config?: any): Promise<Mongoose> => {
  mongoose.Promise = Promise;
  const options = {
    // keepAlive: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  } as ConnectOptions;
  const connection = await mongoose.connect(config.url || MONGO_URL, options);
  // import after connection established
  await import('../models');

  mongooseConnection = connection;
  return connection;
};

export const clearDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (error: any) {
    logger.error(`
    An error occurred while connecting to database, to clear it. 
    Message: ${error.message} 
    `);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.connection.close();
  } catch (error: any) {
    logger.error(`
    An error occurred while connecting to database, to clear it. 
    Message: ${error.message} 
    `);
  }
};
