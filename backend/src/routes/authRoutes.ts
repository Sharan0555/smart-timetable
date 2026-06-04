import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
