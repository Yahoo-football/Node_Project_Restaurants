import paymentRepository from '../repositories/paymentRepositories.js';
import { Payment } from '../models/paymentModel.js';
class PaymentService {
    async getPaymentById(id) {
        this.validateId(id, 'payment');
        const payment = await paymentRepository.findById(id);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return new Payment(payment).toPublicObject();
    }
    async getPaymentsByOrderId(orderId) {
        this.validateId(orderId, 'order');
        const payments = await paymentRepository.findByOrderId(orderId);
        return payments.map((payment) => new Payment(payment).toPublicObject());
    }
    validateId(id, label) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(`Invalid ${label} id`);
        }
    }
}
export default new PaymentService();
//# sourceMappingURL=paymentService.js.map