import { type PaymentRecord } from '../models/paymentModel.js';
declare class PaymentRepository {
    findById(id: number): Promise<PaymentRecord | null>;
    findByOrderId(orderId: number): Promise<PaymentRecord[]>;
}
declare const _default: PaymentRepository;
export default _default;
//# sourceMappingURL=paymentRepositories.d.ts.map