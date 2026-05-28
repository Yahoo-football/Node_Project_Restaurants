import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const categoryRouter = Router();

categoryRouter.use(authMiddleware.authenticate, adminMiddleware.ensureAdmin);

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);

export default categoryRouter;
