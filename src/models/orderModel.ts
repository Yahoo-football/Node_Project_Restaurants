export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: number;
  customer_id: number | null;
  customer_name?: string | null;
  staff_id: number | null;
  staff_name?: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: Date;
}

export interface PublicOrder {
  id: number;
  customerId: number | null;
  customerName: string | null;
  staffId: number | null;
  staffName: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  staffId?: number | null;
}

export class Order {
  constructor(private readonly data: OrderRecord) {}

  public toPublicObject(): PublicOrder {
    return {
      id: this.data.id,
      customerId: this.data.customer_id,
      customerName: this.data.customer_name ?? null,
      staffId: this.data.staff_id,
      staffName: this.data.staff_name ?? null,
      totalAmount: Number(this.data.total_amount),
      status: this.data.status,
      createdAt: this.data.created_at,
    };
  }
}
