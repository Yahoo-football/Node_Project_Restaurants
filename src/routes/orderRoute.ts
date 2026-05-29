import { Router } from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const orderRouter = Router();

orderRouter.use(authMiddleware.authenticateOptional, roleMiddleware.authorize('customer'));

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/my', orderController.getMyOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.delete('/:id', orderController.cancelOrder);

export default orderRouter;

