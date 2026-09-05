import request from 'supertest';
import app from '../src/app';
import { connectTestDB, clearTestDB, closeTestDB } from './setup';

beforeAll(async () => await connectTestDB());
beforeEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  it('should successfully register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.password).toBeUndefined(); // Security check
    expect(res.body.data.token).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should successfully login an existing user', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });
    
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});