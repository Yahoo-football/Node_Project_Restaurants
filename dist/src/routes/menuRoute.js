import { Router } from 'express';
import menuController from '../controllers/menuController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const menuRouter = Router();
menuRouter.use(authMiddleware.authenticate, adminMiddleware.ensureAdmin);
menuRouter.get('/', menuController.getMenuItems);
menuRouter.post('/', menuController.createMenuItem);
menuRouter.put('/:id', menuController.updateMenuItem);
menuRouter.delete('/:id', menuController.deleteMenuItem);
export default menuRouter;
//# sourceMappingURL=menuRoute.js.map