import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }

  app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

};

startServer();