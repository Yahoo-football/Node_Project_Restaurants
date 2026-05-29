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
    async updateOrderStatus(id, status, staffId) {
        await database.getPool().execute('UPDATE orders SET status = ?, staff_id = ? WHERE id = ?', [status, staffId, id]);
    }
}
export default new OrderRepository();
//# sourceMappingURL=orderRepositories.js.map