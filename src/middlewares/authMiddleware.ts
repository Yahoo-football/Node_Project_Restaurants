import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { type AuthTokenPayload } from '../models/userModel.js';

export interface AuthenticatedRequest extends Request {
  authUser?: AuthTokenPayload;
}

class AuthMiddleware {
  public authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authorizationHeader.slice(7).trim();

    try {
      const decoded = jwt.verify(token, this.getJwtSecret()) as AuthTokenPayload;
      req.authUser = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  public authenticateOptional = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader?.startsWith('Bearer ')) {
      const token = authorizationHeader.slice(7).trim();

      try {
        const decoded = jwt.verify(token, this.getJwtSecret()) as AuthTokenPayload;
        req.authUser = decoded;
        next();
        return;
      } catch {
        _res.status(401).json({ message: 'Unauthorized' });
        return;
      }
    }

    req.authUser = {
      id: Number(process.env.DEFAULT_CUSTOMER_ID ?? 1),
      email: process.env.DEFAULT_CUSTOMER_EMAIL ?? 'customer@default.local',
      role: 'customer',
    } as AuthTokenPayload;
    next();
  };

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return secret;
  }
}

export default new AuthMiddleware();
