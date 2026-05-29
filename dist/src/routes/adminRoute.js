import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const adminRouter = Router();
adminRouter.use(authMiddleware.authenticate, adminMiddleware.ensureAdmin);
adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/users/:id', adminController.getUserById);
adminRouter.post('/users', adminController.createUser);
adminRouter.put('/users/:id', adminController.updateUser);
adminRouter.delete('/users/:id', adminController.deleteUser);
adminRouter.get('/dashboard', adminController.getDashboard);
export default adminRouter;
//# sourceMappingURL=adminRoute.js.map