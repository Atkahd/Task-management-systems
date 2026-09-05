import { Request, Response } from 'express';
import Task from '../models/Task';

const isAuthorizedForTask = (task: any, userId: string, role: string): boolean => {
  if (role === 'ADMIN') return true;
  return task.creator.toString() === userId || (task.assignedUser && task.assignedUser.toString() === userId);
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    
    const task = await Task.create({
      title,
      description,
      creator: req.user!._id,
      status: 'TODO'
    });

    res.status(201).json({ success: true, message: 'Task created', data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const query = user.role === 'ADMIN' 
      ? {} 
      : { $or: [{ creator: user._id }, { assignedUser: user._id }] };

    const tasks = await Task.find(query)
      .populate('creator', 'name email')
      .populate('assignedUser', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Tasks retrieved', data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('assignedUser', 'name email');

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found', error: 'NOT_FOUND' });
      return;
    }

    
    if (!isAuthorizedForTask(task, req.user!._id.toString(), req.user!.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to view this task', error: 'FORBIDDEN' });
      return;
    }

    res.status(200).json({ success: true, message: 'Task retrieved', data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found', error: 'NOT_FOUND' });
      return;
    }

    
    if (!isAuthorizedForTask(task, req.user!._id.toString(), req.user!.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to update this task', error: 'FORBIDDEN' });
      return;
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    await task.save();

    res.status(200).json({ success: true, message: 'Task updated', data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found', error: 'NOT_FOUND' });
      return;
    }

   
    if (!isAuthorizedForTask(task, req.user!._id.toString(), req.user!.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this task', error: 'FORBIDDEN' });
      return;
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found', error: 'NOT_FOUND' });
      return;
    }

    
    if (!isAuthorizedForTask(task, req.user!._id.toString(), req.user!.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to change status', error: 'FORBIDDEN' });
      return;
    }

    task.status = req.body.status;
    await task.save();

    res.status(200).json({ success: true, message: 'Status updated', data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

export const assignTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    const { assignedUser } = req.body;
    const user = req.user!;
    
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found', error: 'NOT_FOUND' });
      return;
    }

    if (user.role === 'USER') {
      
      if (assignedUser !== user._id.toString()) {
        res.status(403).json({ success: false, message: 'You can only assign tasks to yourself', error: 'FORBIDDEN' });
        return;
      }

      if (task.assignedUser !== null) {
        res.status(409).json({ success: false, message: 'Task is already assigned to someone', error: 'CONFLICT' });
        return;
      }
    }

    task.assignedUser = assignedUser;
    await task.save();

    await task.populate('assignedUser', 'name email');

    res.status(200).json({ success: true, message: 'Task assigned successfully', data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};