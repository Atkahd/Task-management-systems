import api from './api';
import { User } from '@/types';
import { Task } from './task.service';

export interface DashboardStats {
  users: { total: number };
  tasks: { total: number; todo: number; doing: number; done: number; unassigned: number };
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/admin/users');
  return response.data.data.users;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get('/admin/tasks');
  return response.data.data.tasks;
};

export const getSystemStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/stats');
  return response.data.data.stats;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};