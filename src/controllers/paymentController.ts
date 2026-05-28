import { type Request, type Response } from 'express';
import paymentService from '../services/paymentService.js';

class PaymentController {
  public getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await paymentService.getPaymentById(Number(req.params.id));
      res.status(200).json({ message: 'Payment fetched successfully', data: payment });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getPaymentsByOrderId = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await paymentService.getPaymentsByOrderId(Number(req.params.orderId));
      res.status(200).json({ message: 'Payments fetched successfully', data: payments });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found') ? 404 : message.includes('Invalid') ? 400 : 500;

    res.status(statusCode).json({ message });
  }
}

export default new PaymentController();
