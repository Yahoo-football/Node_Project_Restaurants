import paymentRepository from '../repositories/paymentRepositories.js';
import { Payment, type PublicPayment } from '../models/paymentModel.js';

class PaymentService {
  public async getPaymentById(id: number): Promise<PublicPayment> {
    this.validateId(id, 'payment');

    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return new Payment(payment).toPublicObject();
  }

  public async getPaymentsByOrderId(orderId: number): Promise<PublicPayment[]> {
    this.validateId(orderId, 'order');

    const payments = await paymentRepository.findByOrderId(orderId);
    return payments.map((payment) => new Payment(payment).toPublicObject());
  }

  private validateId(id: number, label: string): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Invalid ${label} id`);
    }
  }
}

export default new PaymentService();
