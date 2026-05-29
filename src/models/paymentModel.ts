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

export class Payment {
  constructor(private readonly data: PaymentRecord) {}

  public toPublicObject(): PublicPayment {
    return {
      id: this.data.id,
      orderId: this.data.order_id,
      amount: Number(this.data.amount),
      status: this.data.status,
      paymentMethod: this.data.payment_method,
      transactionReference: this.data.transaction_reference,
      createdAt: this.data.created_at,
    };
  }
}
