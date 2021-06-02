import { Router } from 'express';
import { activeAccount, signup } from '../controllers/auth.controller';
import { validSignup } from '../middlewares/valid';

const router = Router();

router.route('/signup').post(validSignup, signup);
router.route('/active').post(activeAccount);

export default router;
