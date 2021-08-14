import { Router } from 'express';
import { resetPassword, updateUser, getUser } from '../controllers/user.controller';
import { auth } from '../middlewares/auth';

const router = Router();
router.route('/').patch(auth, updateUser);
router.route('/reset_password').patch(auth, resetPassword);
router.route('/:id').get(getUser);

export default router;
