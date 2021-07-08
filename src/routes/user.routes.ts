import { Router } from 'express';
import { updateUser } from '../controllers/user.controller';
import { auth } from '../middlewares/auth';

const router = Router();
router.route('/').patch(auth, updateUser);

export default router;
