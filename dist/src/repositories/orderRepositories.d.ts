import { type OrderItemRecord, type OrderRecord, type OrderStatus } from '../models/orderModel.js';
declare class OrderRepository {
    findAllOrders(): Promise<OrderRecord[]>;
    findOrderById(id: number): Promise<OrderRecord | null>;
    findItemsByOrderIds(orderIds: number[]): Promise<OrderItemRecord[]>;
    createOrder(customerId: number, totalPrice: number): Promise<OrderRecord>;
    createOrderItems(orderId: number, items: {
        menu_item_id: number;
        quantity: number;
        price: number;
    }[]): Promise<void>;
    findOrdersByCustomerId(customerId: number): Promise<OrderRecord[]>;
    updateOrderStatus(id: number, status: OrderStatus, staffId: number | null): Promise<void>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=orderRepositories.d.ts.map