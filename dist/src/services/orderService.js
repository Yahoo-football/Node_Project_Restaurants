import { Order } from '../models/orderModel.js';
import orderRepository from '../repositories/orderRepositories.js';
class OrderService {
    async getAllOrders() {
        const orders = await orderRepository.findAllOrders();
        const items = await orderRepository.findItemsByOrderIds(orders.map((order) => order.id));
        return orders.map((order) => new Order(order, this.itemsForOrder(items, order.id)).toPublicObject());
    }
    async getOrderById(id) {
        this.validateId(id);
        const order = await orderRepository.findOrderById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        const items = await orderRepository.findItemsByOrderIds([id]);
        return new Order(order, items).toPublicObject();
    }
    async acceptOrder(orderId, staffId) {
        this.validateId(orderId);
        this.validateStaffId(staffId);
        const order = await orderRepository.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.status !== 'pending') {
            throw new Error('Only pending orders can be accepted');
        }
        await orderRepository.updateOrderStatus(orderId, 'completed', staffId);
        return this.getOrderById(orderId);
    }
    async cancelOrder(orderId, staffId) {
        this.validateId(orderId);
        this.validateStaffId(staffId);
        const order = await orderRepository.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.status === 'completed' || order.status === 'cancelled') {
            throw new Error('Completed or cancelled orders cannot be cancelled');
        }
        await orderRepository.updateOrderStatus(orderId, 'cancelled', order.staff_id ?? staffId);
        return this.getOrderById(orderId);
    }
    itemsForOrder(items, orderId) {
        return items.filter((item) => item.order_id === orderId);
    }
    validateId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid order id');
        }
    }
    validateStaffId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid staff id');
        }
    }
}
export default new OrderService();
//# sourceMappingURL=orderService.js.map