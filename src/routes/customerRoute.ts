import { Router } from 'express';
import customerController from '../controllers/customerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const customerRouter = Router();

customerRouter.use(authMiddleware.authenticateOptional, roleMiddleware.authorize('customer'));

// Cart endpoints (customer)
customerRouter.get('/', customerController.getCart);
customerRouter.post('/add', customerController.addToCart);
customerRouter.put('/update/:itemId', customerController.updateCartItem);
customerRouter.delete('/remove/:itemId', customerController.removeCartItem);
customerRouter.delete('/clear', customerController.clearCart);

export default customerRouter;

