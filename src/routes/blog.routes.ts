import { Router } from 'express';
import { createBlog, getBlogs } from '../controllers/blog.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.route('/').post(auth, createBlog);
router.route('/home').get(getBlogs);

export default router;
