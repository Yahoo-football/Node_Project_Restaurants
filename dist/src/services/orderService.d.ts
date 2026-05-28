import { type OrderStatus, type PublicOrder } from '../models/orderModel.js';
declare class OrderService {
    private readonly allowedStatuses;
    getOrders(): Promise<PublicOrder[]>;
    updateOrderStatus(id: number, status: OrderStatus, staffId?: number | null): Promise<PublicOrder>;
    private validateId;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=orderService.d.ts.map