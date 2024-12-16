import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const DB_URL = process.env.MONGODB_URL || '';
const MongoConnect = () => {
  try {
    mongoose.connect(DB_URL, {});
    console.log('Connected To DB successfully');
  } catch (error) {
    throw new Error('Error connecting to database');
  }
};

export default MongoConnect;
