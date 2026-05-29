import { type CreateOrderInput, type OrderResponse } from '../models/orderModel.js';
declare class OrderService {
    createOrder(customerId: number, data: CreateOrderInput): Promise<OrderResponse>;
    getMyOrders(customerId: number): Promise<OrderResponse[]>;
    getOrderById(customerId: number, orderId: number): Promise<OrderResponse>;
    cancelOrder(customerId: number, orderId: number): Promise<OrderResponse>;
    private groupOrderRows;
    private buildOrderResponse;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=orderService.d.ts.map