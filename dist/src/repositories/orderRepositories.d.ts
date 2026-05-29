import { type OrderItemRecord, type OrderRecord, type OrderStatus } from '../models/orderModel.js';
declare class OrderRepository {
    findAllOrders(): Promise<OrderRecord[]>;
    findOrderById(id: number): Promise<OrderRecord | null>;
    findItemsByOrderIds(orderIds: number[]): Promise<OrderItemRecord[]>;
    updateOrderStatus(id: number, status: OrderStatus, staffId: number | null): Promise<void>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=orderRepositories.d.ts.map