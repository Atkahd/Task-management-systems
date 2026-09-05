import api from './api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'TODO' | 'DOING' | 'DONE';
  creator: { _id: string; name: string; email: string };
  assignedUser: { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.data.tasks;
};

export const updateTaskStatus = async (taskId: string, status: 'TODO' | 'DOING' | 'DONE'): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data.task;
};

export const createTask = async (data: { title: string; description: string }): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data.data.task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

export const assignTask = async (taskId: string, assignedUser: string | null): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/assign`, { assignedUser });
  return response.data.data.task;
};