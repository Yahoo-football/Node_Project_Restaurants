import { type Request, type Response } from 'express';
import authService from '../services/authService.js';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';

class AuthController {
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body ?? {};
      const result = await authService.register({
        name: body.name,
        email: body.email,
        password: body.password,
        phone: body.phone,
        role: 'customer',
      });

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body ?? {};
      const result = await authService.login({
        email: body.email,
        password: body.password,
      });

      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await authService.getCurrentUser(req.authUser.id);

      res.status(200).json({
        message: 'Current user fetched successfully',
        data: user,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode =
      message === 'Unauthorized'
        ? 401
        : message === 'User not found'
          ? 404
          : message.includes('Invalid') ||
              message.includes('required') ||
              message.includes('configured') ||
              message.includes('registered')
            ? 400
            : 500;

    res.status(statusCode).json({ message });
  }
}

export default new AuthController();
