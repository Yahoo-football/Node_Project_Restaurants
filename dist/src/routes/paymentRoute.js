import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
const paymentRouter = Router();
paymentRouter.use(authMiddleware.authenticate, roleMiddleware.authorize('customer'));
paymentRouter.post('/', paymentController.createPayment);
paymentRouter.get('/:id', paymentController.getPaymentById);
export default paymentRouter;
//# sourceMappingURL=paymentRoute.js.map