import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/orderModel.js';
class OrderRepository {
    async createOrder(customerId, totalPrice, notes) {
        const [result] = await database.getPool().execute('INSERT INTO orders (customer_id, total_price, notes) VALUES (?, ?, ?)', [customerId, totalPrice, notes]);
        const orderId = result.insertId;
        const order = await this.findOrderRecordById(orderId);
        if (!order) {
            throw new Error('Unable to create order');
        }
        return order;
    }
    async createOrderItems(orderId, items) {
        if (!items.length) {
            return;
        }
        const values = items.map((item) => [orderId, item.menuItemId, item.quantity, item.price]);
        await database.getPool().query('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?', [values]);
    }
    async findOrdersByCustomerId(customerId) {
        const [rows] = await database.getPool().execute(`
      SELECT
        o.*,
        oi.id AS order_item_id,
        oi.menu_item_id,
        oi.quantity,
        oi.price,
        mi.name AS item_name
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `, [customerId]);
        return rows;
    }
    async findOrderById(orderId) {
        const [rows] = await database.getPool().execute(`
      SELECT
        o.*,
        oi.id AS order_item_id,
        oi.menu_item_id,
        oi.quantity,
        oi.price,
        mi.name AS item_name
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE o.id = ?
    `, [orderId]);
        return rows;
    }
    async findOrderRecordById(orderId) {
        const [rows] = await database.getPool().execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
        return rows[0] ?? null;
    }
    async updateOrderStatus(orderId, status) {
        await database.getPool().execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        const order = await this.findOrderRecordById(orderId);
        if (!order) {
            throw new Error('Unable to update order status');
        }
        return order;
    }
}
export default new OrderRepository();
//# sourceMappingURL=orderRepositories.js.map