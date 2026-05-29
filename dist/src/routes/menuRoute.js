import { Router } from 'express';
import menuController from '../controllers/menuController.js';
const menuRouter = Router();
menuRouter.get('/categories', menuController.getCategories);
menuRouter.get('/', menuController.getMenuItems);
menuRouter.get('/:id', menuController.getMenuItemById);
export default menuRouter;
//# sourceMappingURL=menuRoute.js.map