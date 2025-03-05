import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbconfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
