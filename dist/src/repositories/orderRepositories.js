import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/orderModel.js';
class OrderRepository {
    async findAll() {
        const [rows] = await database.getPool().execute(`
        SELECT
          o.*,
          customer.name AS customer_name,
          staff.name AS staff_name
        FROM orders o
        LEFT JOIN users customer ON customer.id = o.customer_id
        LEFT JOIN users staff ON staff.id = o.staff_id
        ORDER BY o.created_at DESC
      `);
        return rows;
    }
    async findById(id) {
        const [rows] = await database.getPool().execute(`
        SELECT
          o.*,
          customer.name AS customer_name,
          staff.name AS staff_name
        FROM orders o
        LEFT JOIN users customer ON customer.id = o.customer_id
        LEFT JOIN users staff ON staff.id = o.staff_id
        WHERE o.id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async updateStatus(id, data) {
        await database.getPool().execute('UPDATE orders SET status = ?, staff_id = ? WHERE id = ?', [data.status, data.staffId ?? null, id]);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Order not found');
        }
        return updated;
    }
}
export default new OrderRepository();
//# sourceMappingURL=orderRepositories.js.map