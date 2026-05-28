import { Router } from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const orderRouter = Router();

orderRouter.use(authMiddleware.authenticate, adminMiddleware.ensureAdmin);

orderRouter.get('/', orderController.getOrders);
orderRouter.put('/:id/status', orderController.updateStatus);

export default orderRouter;
