import { Order } from '../models/orderModel.js';
import orderRepository from '../repositories/orderRepositories.js';
import menuRepository from '../repositories/menuRepositories.js';
class OrderService {
    async getAllOrders() {
        const orders = await orderRepository.findAllOrders();
        const items = await orderRepository.findItemsByOrderIds(orders.map((order) => order.id));
        return orders.map((order) => new Order(order, this.itemsForOrder(items, order.id)).toPublicObject());
    }
    async getOrdersByCustomerId(customerId) {
        const orders = await orderRepository.findOrdersByCustomerId(customerId);
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
    async getOrderByIdForCustomer(orderId, customerId) {
        this.validateId(orderId);
        const order = await orderRepository.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.customer_id !== customerId) {
            throw new Error('Forbidden');
        }
        const items = await orderRepository.findItemsByOrderIds([orderId]);
        return new Order(order, items).toPublicObject();
    }
    async createOrder(customerId, items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Order items are required');
        }
        const normalizedItems = items.map((item, index) => {
            const menuItemId = Number(item.menuItemId);
            const quantity = Number(item.quantity);
            if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
                throw new Error(`Invalid menu item id at index ${index}`);
            }
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error(`Invalid quantity at index ${index}`);
            }
            return { menuItemId, quantity };
        });
        const menuItems = await Promise.all(normalizedItems.map((item) => menuRepository.findById(item.menuItemId)));
        const orderItems = normalizedItems.map((item, index) => {
            const menuItem = menuItems[index];
            if (!menuItem) {
                throw new Error(`Menu item not found for id ${item.menuItemId}`);
            }
            return {
                menu_item_id: item.menuItemId,
                quantity: item.quantity,
                price: Number(menuItem.price),
            };
        });
        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await orderRepository.createOrder(customerId, totalPrice);
        await orderRepository.createOrderItems(order.id, orderItems);
        return this.getOrderById(order.id);
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