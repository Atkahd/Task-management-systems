import { Router } from 'express';
import { 
  getTasks, getTaskById, createTask, 
  updateTask, deleteTask, updateTaskStatus, assignTask 
} from '../controllers/task.controller';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth.middleware';
import { 
  createTaskSchema, updateTaskSchema, 
  updateStatusSchema, assignTaskSchema 
} from '../validators/task.validator';

const router = Router();


router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

router.patch('/:id/status', validate(updateStatusSchema), updateTaskStatus);
router.patch('/:id/assign', validate(assignTaskSchema), assignTask);

export default router;