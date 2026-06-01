import { type Request, type Response } from 'express';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';
declare class CustomerController {
    getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getMenuItems: (_req: Request, res: Response) => Promise<void>;
    getOrders: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getOrderById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    placeOrder: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    private handleError;
}
declare const _default: CustomerController;
export default _default;
//# sourceMappingURL=customerController.d.ts.map