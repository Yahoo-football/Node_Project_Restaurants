import { type PublicPayment } from '../models/paymentModel.js';
declare class PaymentService {
    getPaymentById(id: number): Promise<PublicPayment>;
    getPaymentsByOrderId(orderId: number): Promise<PublicPayment[]>;
    private validateId;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=paymentService.d.ts.map