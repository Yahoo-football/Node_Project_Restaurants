import paymentRepository from '../repositories/paymentRepositories.js';
import orderRepository from '../repositories/orderRepositories.js';
import {} from '../models/paymentModel.js';
class PaymentService {
    async createPayment(customerId, data) {
        if (!data.orderId || !data.paymentMethod || !data.amount) {
            throw new Error('Order id, payment method, and amount are required');
        }
        const order = await orderRepository.findOrderRecordById(data.orderId);
        if (!order || order.customer_id !== customerId) {
            throw new Error('Order not found');
        }
        if (data.amount !== Number(order.total_price)) {
            throw new Error('Payment amount must equal the order total');
        }
        const payment = await paymentRepository.createPayment({
            orderId: data.orderId,
            paymentMethod: data.paymentMethod,
            paymentStatus: 'paid',
            amount: data.amount,
        });
        return this.mapPayment(payment);
    }
    async getPaymentById(customerId, paymentId) {
        const payment = await paymentRepository.findPaymentById(paymentId);
        if (!payment || payment.customer_id !== customerId) {
            throw new Error('Payment not found');
        }
        return this.mapPayment(payment);
    }
    mapPayment(payment) {
        return {
            id: payment.id,
            orderId: payment.order_id,
            paymentMethod: payment.payment_method,
            paymentStatus: payment.payment_status,
            transactionId: payment.transaction_id,
            amount: Number(payment.amount),
            paidAt: payment.paid_at,
            createdAt: payment.created_at,
        };
    }
}
export default new PaymentService();
//# sourceMappingURL=paymentService.js.map