import { Router } from 'express';
import { createBlog, getBlogs, getBlogsByCategory } from '../controllers/blog.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.route('/').post(auth, createBlog);
router.route('/home').get(getBlogs);
router.route('/category/:id').get(getBlogsByCategory);

export default router;
