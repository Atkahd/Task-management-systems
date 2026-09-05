import { z } from 'zod';


const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional().default(''),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['TODO', 'DOING', 'DONE']),
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    // Can be a valid ObjectId (user) or null (to unassign)
    assignedUser: objectIdSchema.nullable(),
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});