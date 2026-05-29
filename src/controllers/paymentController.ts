import { type Response } from 'express';
import paymentService from '../services/paymentService.js';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { type PaymentMethod } from '../models/paymentModel.js';

class PaymentController {
  public createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const payment = await paymentService.createPayment(customerId, {
        orderId: Number(req.body.orderId),
        paymentMethod: req.body.paymentMethod?.toString() as PaymentMethod,
        amount: Number(req.body.amount),
      });

      res.status(201).json({ message: 'Payment recorded successfully', data: payment });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getPaymentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const paymentId = Number(req.params.id);
      const payment = await paymentService.getPaymentById(customerId, paymentId);
      res.status(200).json({ message: 'Payment fetched successfully', data: payment });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message === 'Payment not found' ? 404 : 400;
    res.status(statusCode).json({ message });
  }
}

export default new PaymentController();
