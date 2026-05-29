import { type RowDataPacket } from 'mysql2/promise';
import { type PaymentMethod, type PaymentStatus, type PaymentRecord } from '../models/paymentModel.js';
interface PaymentRow extends RowDataPacket, PaymentRecord {
    customer_id: number;
}
declare class PaymentRepository {
    createPayment(data: {
        orderId: number;
        paymentMethod: PaymentMethod;
        paymentStatus: PaymentStatus;
        amount: number;
    }): Promise<PaymentRow>;
    findPaymentById(paymentId: number): Promise<PaymentRow | null>;
}
declare const _default: PaymentRepository;
export default _default;
//# sourceMappingURL=paymentRepositories.d.ts.map