export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export interface OrderRecord {
    id: number;
    customer_id: number;
    staff_id: number | null;
    status: OrderStatus;
    total_price: number | string | null;
    created_at: Date;
    customer_name: string;
    staff_name: string | null;
}
export interface OrderItemRecord {
    id: number;
    order_id: number;
    menu_item_id: number;
    menu_item_name: string;
    quantity: number;
    price: number | string;
}
export interface CreateOrderItemInput {
    menuItemId: number;
    quantity: number;
}
export interface CreateOrderInput {
    items: CreateOrderItemInput[];
}
export interface PublicOrderItem {
    id: number;
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    price: number;
}
export interface PublicOrder {
    id: number;
    customerId: number;
    customerName: string;
    staffId: number | null;
    staffName: string | null;
    status: OrderStatus;
    totalPrice: number;
    createdAt: Date;
    items: PublicOrderItem[];
}
export declare class Order {
    private readonly data;
    private readonly items;
    constructor(data: OrderRecord, items?: OrderItemRecord[]);
    toPublicObject(): PublicOrder;
}
//# sourceMappingURL=orderModel.d.ts.map