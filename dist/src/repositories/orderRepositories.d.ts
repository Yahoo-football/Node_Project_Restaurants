import { type OrderRecord, type UpdateOrderStatusInput } from '../models/orderModel.js';
declare class OrderRepository {
    findAll(): Promise<OrderRecord[]>;
    findById(id: number): Promise<OrderRecord | null>;
    updateStatus(id: number, data: UpdateOrderStatusInput): Promise<OrderRecord>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=orderRepositories.d.ts.map