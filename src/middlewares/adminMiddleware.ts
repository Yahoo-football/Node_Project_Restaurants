import { type NextFunction, type Response } from 'express';
import { type AuthenticatedRequest } from './authMiddleware.js';

class AdminMiddleware {
  public ensureAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.authUser.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}

export default new AdminMiddleware();
