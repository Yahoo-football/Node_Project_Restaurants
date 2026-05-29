import { type RowDataPacket } from 'mysql2/promise';
import { type OrderRecord } from '../models/orderModel.js';
interface OrderRow extends RowDataPacket, OrderRecord {
    order_item_id?: number;
    menu_item_id?: number;
    quantity?: number;
    price?: number;
    item_name?: string;
}
interface OrderItemInsert {
    menuItemId: number;
    quantity: number;
    price: number;
}
declare class OrderRepository {
    createOrder(customerId: number, totalPrice: number, notes: string | null): Promise<OrderRecord>;
    createOrderItems(orderId: number, items: OrderItemInsert[]): Promise<void>;
    findOrdersByCustomerId(customerId: number): Promise<OrderRow[]>;
    findOrderById(orderId: number): Promise<OrderRow[]>;
    findOrderRecordById(orderId: number): Promise<OrderRecord | null>;
    updateOrderStatus(orderId: number, status: OrderRecord['status']): Promise<OrderRecord>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=orderRepositories.d.ts.map