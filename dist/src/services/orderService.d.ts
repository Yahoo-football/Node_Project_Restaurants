import { type PublicOrder } from '../models/orderModel.js';
declare class OrderService {
    getAllOrders(): Promise<PublicOrder[]>;
    getOrderById(id: number): Promise<PublicOrder>;
    acceptOrder(orderId: number, staffId: number): Promise<PublicOrder>;
    cancelOrder(orderId: number, staffId: number): Promise<PublicOrder>;
    private itemsForOrder;
    private validateId;
    private validateStaffId;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=orderService.d.ts.map