import { Router } from 'express';
import menuController from '../controllers/menuController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const menuRouter = Router();
menuRouter.get('/', authMiddleware.authenticate, menuController.getMenuItems);
menuRouter.post('/', authMiddleware.authenticate, adminMiddleware.ensureAdmin, menuController.createMenuItem);
menuRouter.put('/:id', authMiddleware.authenticate, adminMiddleware.ensureAdmin, menuController.updateMenuItem);
menuRouter.delete('/:id', authMiddleware.authenticate, adminMiddleware.ensureAdmin, menuController.deleteMenuItem);
export default menuRouter;
//# sourceMappingURL=menuRoute.js.map