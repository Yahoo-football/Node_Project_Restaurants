import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const paymentRouter = Router();

paymentRouter.use(authMiddleware.authenticate, adminMiddleware.ensureAdmin);

paymentRouter.get('/:id', paymentController.getPaymentById);
paymentRouter.get('/order/:orderId', paymentController.getPaymentsByOrderId);

export default paymentRouter;
