import { Router } from 'express';
import { signup } from '../controllers/auth.controller';
import { validSignup } from '../middlewares/valid';

const router = Router();

router.route('/signup').post(validSignup, signup);

export default router;
