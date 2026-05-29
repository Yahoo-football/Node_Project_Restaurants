import { type CreatePaymentInput, type PaymentResponse } from '../models/paymentModel.js';
declare class PaymentService {
    createPayment(customerId: number, data: CreatePaymentInput): Promise<PaymentResponse>;
    getPaymentById(customerId: number, paymentId: number): Promise<PaymentResponse>;
    private mapPayment;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=paymentService.d.ts.map