import orderRepository from '../repositories/orderRepositories.js';
import authRepository from '../repositories/authRepositories.js';
import { Order } from '../models/orderModel.js';
class OrderService {
    allowedStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    async getOrders() {
        const orders = await orderRepository.findAll();
        return orders.map((order) => new Order(order).toPublicObject());
    }
    async updateOrderStatus(id, status, staffId) {
        this.validateId(id);
        if (!this.allowedStatuses.includes(status)) {
            throw new Error('Invalid order status');
        }
        const existing = await orderRepository.findById(id);
        if (!existing) {
            throw new Error('Order not found');
        }
        if (staffId !== undefined && staffId !== null) {
            const staff = await authRepository.findUserById(staffId);
            if (!staff || staff.role !== 'staff') {
                throw new Error('Assigned staff user not found');
            }
        }
        const updated = await orderRepository.updateStatus(id, { status, ...(staffId !== undefined ? { staffId } : {}) });
        return new Order(updated).toPublicObject();
    }
    validateId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid order id');
        }
    }
}
export default new OrderService();
//# sourceMappingURL=orderService.js.map