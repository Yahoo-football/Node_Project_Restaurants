import { type Request, type Response } from 'express';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';
declare class StaffController {
    getOrders: (_req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<void>;
    acceptOrder: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    cancelOrder: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    private handleError;
    private sendError;
    private getErrorName;
}
declare const _default: StaffController;
export default _default;
//# sourceMappingURL=staffController.d.ts.map