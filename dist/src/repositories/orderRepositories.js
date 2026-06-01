import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/orderModel.js';
class OrderRepository {
    async findAllOrders() {
        const [rows] = await database.getPool().execute(`SELECT
        orders.*,
        customers.name AS customer_name,
        staff.name AS staff_name
      FROM orders
      INNER JOIN users AS customers ON customers.id = orders.customer_id
      LEFT JOIN users AS staff ON staff.id = orders.staff_id
      ORDER BY orders.created_at DESC`);
        return rows;
    }
    async findOrderById(id) {
        const [rows] = await database.getPool().execute(`SELECT
        orders.*,
        customers.name AS customer_name,
        staff.name AS staff_name
      FROM orders
      INNER JOIN users AS customers ON customers.id = orders.customer_id
      LEFT JOIN users AS staff ON staff.id = orders.staff_id
      WHERE orders.id = ?
      LIMIT 1`, [id]);
        return rows[0] ?? null;
    }
    async findItemsByOrderIds(orderIds) {
        if (orderIds.length === 0) {
            return [];
        }
        const placeholders = orderIds.map(() => '?').join(', ');
        const [rows] = await database.getPool().execute(`SELECT
        order_items.*,
        menu_items.name AS menu_item_name
      FROM order_items
      INNER JOIN menu_items ON menu_items.id = order_items.menu_item_id
      WHERE order_items.order_id IN (${placeholders})
      ORDER BY order_items.id ASC`, orderIds);
        return rows;
    }
    async createOrder(customerId, totalPrice) {
        const [result] = await database.getPool().execute('INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, ?)', [customerId, totalPrice, 'pending']);
        const created = await this.findOrderById(result.insertId);
        if (!created) {
            throw new Error('Unable to load created order');
        }
        return created;
    }
    async createOrderItems(orderId, items) {
        if (items.length === 0) {
            return;
        }
        const values = [];
        const placeholders = items.map(() => '(?, ?, ?, ?)').join(', ');
        for (const item of items) {
            values.push(orderId, item.menu_item_id, item.quantity, item.price);
        }
        await database.getPool().execute(`INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ${placeholders}`, values);
    }
    async findOrdersByCustomerId(customerId) {
        const [rows] = await database.getPool().execute(`SELECT
        orders.*,
        customers.name AS customer_name,
        staff.name AS staff_name
      FROM orders
      INNER JOIN users AS customers ON customers.id = orders.customer_id
      LEFT JOIN users AS staff ON staff.id = orders.staff_id
      WHERE orders.customer_id = ?
      ORDER BY orders.created_at DESC`, [customerId]);
        return rows;
    }
    async updateOrderStatus(id, status, staffId) {
        await database.getPool().execute('UPDATE orders SET status = ?, staff_id = ? WHERE id = ?', [status, staffId, id]);
    }
}
export default new OrderRepository();
//# sourceMappingURL=orderRepositories.js.map