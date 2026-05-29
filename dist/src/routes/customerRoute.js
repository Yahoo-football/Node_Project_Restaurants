import { Router } from 'express';
import customerController from '../controllers/customerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
const customerRouter = Router();
customerRouter.use(authMiddleware.authenticateOptional, roleMiddleware.authorize('customer'));
// Expose only the customer actions requested:
// - add item to cart
customerRouter.post('/add', customerController.addToCart);
export default customerRouter;
//# sourceMappingURL=customerRoute.js.map