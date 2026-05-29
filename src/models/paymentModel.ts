export type PaymentMethod = 'cash' | 'card' | 'qr';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentRecord {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  amount: number;
  paid_at: Date | null;
  created_at: Date;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  amount: number;
  paidAt: Date | null;
  createdAt: Date;
}

export interface CreatePaymentInput {
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
}

