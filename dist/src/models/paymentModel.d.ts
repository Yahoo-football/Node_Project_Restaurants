export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export interface PaymentRecord {
    id: number;
    order_id: number;
    amount: number;
    status: PaymentStatus;
    payment_method: string | null;
    transaction_reference: string | null;
    created_at: Date;
}
export interface PublicPayment {
    id: number;
    orderId: number;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionReference: string | null;
    createdAt: Date;
}
export declare class Payment {
    private readonly data;
    constructor(data: PaymentRecord);
    toPublicObject(): PublicPayment;
}
//# sourceMappingURL=paymentModel.d.ts.map