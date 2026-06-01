import { type Request, type Response } from 'express';
import authService from '../services/authService.js';
import menuService from '../services/menuService.js';
import orderService from '../services/orderService.js';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';

class CustomerController {
  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await authService.getCurrentUser(req.authUser.id);
      res.status(200).json({ message: 'Customer profile fetched successfully', data: user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMenuItems = async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await menuService.getMenuItems();
      res.status(200).json({ message: 'Menu fetched successfully', data: items });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orders = await orderService.getOrdersByCustomerId(req.authUser.id);
      res.status(200).json({ message: 'Customer orders fetched successfully', data: orders });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        res.status(400).json({ message: 'Invalid order id' });
        return;
      }

      const order = await orderService.getOrderByIdForCustomer(orderId, req.authUser.id);
      res.status(200).json({ message: 'Order fetched successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public placeOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.authUser) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const order = await orderService.createOrder(req.authUser.id, req.body.items);
      res.status(201).json({ message: 'Order placed successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode =
      message === 'User not found' ||
      message === 'Order not found' ||
      message.includes('Invalid') ||
      message.includes('required') ||
      message.includes('not found')
        ? 400
        : message === 'Unauthorized'
          ? 401
          : message === 'Forbidden'
            ? 403
            : 500;

    res.status(statusCode).json({ message });
  }
}

export default new CustomerController();
