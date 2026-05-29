import { Router } from 'express';
import staffController from '../controllers/staffController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import staffMiddleware from '../middlewares/staffMiddleware.js';
const staffRouter = Router();
staffRouter.use(authMiddleware.authenticate);
staffRouter.use(staffMiddleware.ensureStaff);
staffRouter.get('/orders', staffController.getOrders);
staffRouter.get('/orders/:id', staffController.getOrderById);
staffRouter.patch('/orders/:id/accept', staffController.acceptOrder);
staffRouter.patch('/orders/:id/cancel', staffController.cancelOrder);
export default staffRouter;
//# sourceMappingURL=staffRoute.js.map