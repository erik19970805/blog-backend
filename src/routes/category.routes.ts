import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/category.controller';
import { auth, authAdmin } from '../middlewares/auth';

const router = Router();
router.route('/').post(auth, authAdmin, createCategory).get(getCategories);
router
  .route('/:id')
  .all(auth, authAdmin)
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
