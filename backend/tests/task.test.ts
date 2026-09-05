import request from 'supertest';
import app from '../src/app';
import { connectTestDB, clearTestDB, closeTestDB } from './setup';
import User from '../src/models/User';

beforeAll(async () => await connectTestDB());
beforeEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Task Assignment Authorization', () => {
  let adminToken: string;
  let user1Token: string;
  let user2Id: string;
  let taskId: string;

  beforeEach(async () => {
    const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'pass', role: 'ADMIN' });
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass' });
    adminToken = adminRes.body.data.token;

    const u1 = await User.create({ name: 'User1', email: 'u1@test.com', password: 'pass', role: 'USER' });
    const u1Res = await request(app).post('/api/auth/login').send({ email: 'u1@test.com', password: 'pass' });
    user1Token = u1Res.body.data.token;

    
    const u2 = await User.create({ name: 'User2', email: 'u2@test.com', password: 'pass', role: 'USER' });
    user2Id = u2._id.toString();

    
    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Important Task', description: 'Test description' });
    taskId = taskRes.body.data.task._id;
  });

  it('NORMAL USER CANNOT assign a task to another user (Should return 403)', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ assignedUser: user2Id }); 

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('You can only assign tasks to yourself');
  });

  it('NORMAL USER CAN assign an unassigned task to themselves', async () => {
    
    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${user1Token}`);
    const myId = meRes.body.data.user._id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ assignedUser: myId }); 

    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.assignedUser._id).toBe(myId);
  });

  it('ADMIN CAN reassign tasks to any user', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assignedUser: user2Id }); 

    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.assignedUser._id).toBe(user2Id);
  });
});