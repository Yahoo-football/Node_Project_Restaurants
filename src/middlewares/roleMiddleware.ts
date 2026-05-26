import { type NextFunction, type Response } from 'express';
import { type AuthenticatedRequest } from './authMiddleware.js';
import { type UserRole } from '../models/userModel.js';

class RoleMiddleware {
  public authorize = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (!allowedRoles.includes(req.authUser.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      next();
    };
  };
}

export default new RoleMiddleware();
