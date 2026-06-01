import { Router } from 'express';
import customerController from '../controllers/customerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const customerRouter = Router();

customerRouter.get('/me', authMiddleware.authenticate, roleMiddleware.authorize('customer'), customerController.getProfile);
customerRouter.get('/menu', authMiddleware.authenticate, roleMiddleware.authorize('customer'), customerController.getMenuItems);
customerRouter.get('/orders', authMiddleware.authenticate, roleMiddleware.authorize('customer'), customerController.getOrders);
customerRouter.get('/orders/:id', authMiddleware.authenticate, roleMiddleware.authorize('customer'), customerController.getOrderById);
customerRouter.post('/orders', authMiddleware.authenticate, roleMiddleware.authorize('customer'), customerController.placeOrder);

export default customerRouter;
