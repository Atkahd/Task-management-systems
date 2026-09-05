import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'; 
import taskRoutes from './routes/task.routes';
import adminRoutes from './routes/admin.routes';

import { protect } from './middleware/auth.middleware';
import { authorizeRole } from './middleware/role.middleware';


dotenv.config();

const app: Application = express();


app.use(helmet());
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev')); 


app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    message: 'Task Management API is running' 
  });
});


app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/admin-only-test', protect, authorizeRole('ADMIN'), (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome, Admin! You bypassed the security gates.'
  });
});

export default app;