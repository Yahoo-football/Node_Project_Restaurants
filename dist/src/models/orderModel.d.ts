export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export interface OrderRecord {
    id: number;
    customer_id: number;
    staff_id: number | null;
    status: OrderStatus;
    total_price: number;
    notes: string | null;
    created_at: Date;
}
export interface OrderItemRecord {
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
}
export interface OrderItemDetail {
    id: number;
    menuItemId: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}
export interface OrderResponse {
    id: number;
    customerId: number;
    staffId: number | null;
    status: OrderStatus;
    totalPrice: number;
    notes: string | null;
    createdAt: Date;
    items: OrderItemDetail[];
}
export interface CreateOrderInput {
    notes?: string;
}
//# sourceMappingURL=orderModel.d.ts.map