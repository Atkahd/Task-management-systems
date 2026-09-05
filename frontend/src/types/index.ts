export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}