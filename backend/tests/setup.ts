import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectTestDB = async () => {
  const uri = 'mongodb://localhost:27017/task-management-test-db';
  await mongoose.connect(uri);
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};