import { type NextFunction, type Response } from 'express';
import { type AuthenticatedRequest } from './authMiddleware.js';
declare class AdminMiddleware {
    ensureAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
declare const _default: AdminMiddleware;
export default _default;
//# sourceMappingURL=adminMiddleware.d.ts.map