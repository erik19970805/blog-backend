import { Router } from 'express';
import { createBlog } from '../controllers/blog.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.route('/').post(auth, createBlog);

export default router;
