import { type Request, type Response } from 'express';
import orderService from '../services/orderService.js';

class OrderController {
  public getOrders = async (_req: Request, res: Response): Promise<void> => {
    try {
      const orders = await orderService.getOrders();
      res.status(200).json({ message: 'Orders fetched successfully', data: orders });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await orderService.updateOrderStatus(
        Number(req.params.id),
        req.body.status,
        req.body.staffId !== undefined ? Number(req.body.staffId) : undefined,
      );

      res.status(200).json({ message: 'Order status updated successfully', data: order });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found')
      ? 404
      : message.includes('Invalid') || message.includes('Assigned')
        ? 400
        : 500;

    res.status(statusCode).json({ message });
  }
}

export default new OrderController();
