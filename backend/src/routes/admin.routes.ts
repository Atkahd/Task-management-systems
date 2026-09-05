import { Router } from 'express';
import { getAllUsers, getAllTasks, getDashboardStats } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();


router.use(protect, authorizeRole('ADMIN'));

router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.get('/stats', getDashboardStats);

export default router;