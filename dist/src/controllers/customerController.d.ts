import { type Response } from 'express';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';
declare class CustomerController {
    getCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    addToCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateCartItem: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    removeCartItem: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    clearCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    private handleError;
}
declare const _default: CustomerController;
export default _default;
//# sourceMappingURL=customerController.d.ts.map