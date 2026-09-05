import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);


router.get('/me', protect, getMe);

export default router;