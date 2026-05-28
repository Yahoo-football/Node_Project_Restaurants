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
export declare class Order {
    private readonly data;
    constructor(data: OrderRecord);
    toPublicObject(): PublicOrder;
}
//# sourceMappingURL=orderModel.d.ts.map