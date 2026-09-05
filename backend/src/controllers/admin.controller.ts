import { Request, Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Users retrieved', data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find()
      .populate('creator', 'name email role')
      .populate('assignedUser', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'All tasks retrieved', data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const [
      totalUsers,
      totalTasks,
      todoTasks,
      doingTasks,
      doneTasks,
      unassignedTasks
    ] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'TODO' }),
      Task.countDocuments({ status: 'DOING' }),
      Task.countDocuments({ status: 'DONE' }),
      Task.countDocuments({ assignedUser: null })
    ]);

    const stats = {
      users: {
        total: totalUsers
      },
      tasks: {
        total: totalTasks,
        todo: todoTasks,
        doing: doingTasks,
        done: doneTasks,
        unassigned: unassignedTasks
      }
    };

    res.status(200).json({ success: true, message: 'Stats retrieved', data: { stats } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving stats', error: (error as Error).message });
  }
};