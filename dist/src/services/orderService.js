import orderRepository from '../repositories/orderRepositories.js';
import customerRepository from '../repositories/customerRepositories.js';
import {} from '../models/orderModel.js';
import {} from '../models/customerModel.js';
class OrderService {
    async createOrder(customerId, data) {
        const cart = await customerRepository.findCartByCustomerId(customerId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const cartItems = await customerRepository.findCartItemsByCartId(cart.id);
        if (!cartItems.length) {
            throw new Error('Cart is empty');
        }
        const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const order = await orderRepository.createOrder(customerId, totalPrice, data.notes ?? null);
        await orderRepository.createOrderItems(order.id, cartItems.map((item) => ({
            menuItemId: item.menu_item_id,
            quantity: item.quantity,
            price: Number(item.price),
        })));
        await customerRepository.clearCartItems(cart.id);
        return this.buildOrderResponse(await orderRepository.findOrderById(order.id));
    }
    async getMyOrders(customerId) {
        const rawOrders = await orderRepository.findOrdersByCustomerId(customerId);
        return this.groupOrderRows(rawOrders, customerId);
    }
    async getOrderById(customerId, orderId) {
        const rawRows = await orderRepository.findOrderById(orderId);
        const orders = this.groupOrderRows(rawRows, customerId);
        if (!orders.length) {
            throw new Error('Order not found');
        }
        const order = orders[0];
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
    async cancelOrder(customerId, orderId) {
        const orderRecord = await orderRepository.findOrderRecordById(orderId);
        if (!orderRecord || orderRecord.customer_id !== customerId) {
            throw new Error('Order not found');
        }
        if (orderRecord.status !== 'pending') {
            throw new Error('Only pending orders can be cancelled');
        }
        await orderRepository.updateOrderStatus(orderId, 'cancelled');
        return this.buildOrderResponse(await orderRepository.findOrderById(orderId));
    }
    groupOrderRows(rows, customerId) {
        const grouped = new Map();
        for (const row of rows) {
            if (!row.id || row.customer_id !== customerId) {
                continue;
            }
            if (!grouped.has(row.id)) {
                grouped.set(row.id, {
                    id: row.id,
                    customerId: row.customer_id,
                    staffId: row.staff_id,
                    status: row.status,
                    totalPrice: Number(row.total_price),
                    notes: row.notes,
                    createdAt: row.created_at,
                    items: [],
                });
            }
            if (row.order_item_id) {
                grouped.get(row.id)?.items.push({
                    id: row.order_item_id,
                    menuItemId: row.menu_item_id,
                    name: row.item_name,
                    quantity: row.quantity,
                    price: Number(row.price),
                    subtotal: Number(row.price) * row.quantity,
                });
            }
        }
        return Array.from(grouped.values());
    }
    buildOrderResponse(rawRows) {
        const orders = this.groupOrderRows(rawRows, rawRows[0]?.customer_id ?? 0);
        if (!orders.length) {
            throw new Error('Order not found');
        }
        const order = orders[0];
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
}
export default new OrderService();
//# sourceMappingURL=orderService.js.map