import { type Response } from 'express';
import orderService from '../services/orderService.js';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';

class OrderController {
  public createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const order = await orderService.createOrder(customerId, {
        notes: req.body.notes?.toString(),
      });

      res.status(201).json({ message: 'Order created successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orders = await orderService.getMyOrders(customerId);
      res.status(200).json({ message: 'Orders fetched successfully', data: orders });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orderId = Number(req.params.id);
      const order = await orderService.getOrderById(customerId, orderId);
      res.status(200).json({ message: 'Order fetched successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const orderId = Number(req.params.id);
      const order = await orderService.cancelOrder(customerId, orderId);
      res.status(200).json({ message: 'Order cancelled successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message === 'Order not found' ? 404 : 400;
    res.status(statusCode).json({ message });
  }
}

export default new OrderController();
