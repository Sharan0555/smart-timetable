import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(env.mongoUri);
  return mongoose.connection;
};
