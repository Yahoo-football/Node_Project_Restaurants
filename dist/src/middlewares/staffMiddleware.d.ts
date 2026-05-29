import { type NextFunction, type Response } from 'express';
import { type AuthenticatedRequest } from './authMiddleware.js';
declare class StaffMiddleware {
    ensureStaff: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
declare const _default: StaffMiddleware;
export default _default;
//# sourceMappingURL=staffMiddleware.d.ts.map