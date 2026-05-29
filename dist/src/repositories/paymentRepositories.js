import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/paymentModel.js';
class PaymentRepository {
    async findById(id) {
        const [rows] = await database
            .getPool()
            .execute('SELECT * FROM payments WHERE id = ? LIMIT 1', [id]);
        return rows[0] ?? null;
    }
    async findByOrderId(orderId) {
        const [rows] = await database
            .getPool()
            .execute('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC', [orderId]);
        return rows;
    }
}
export default new PaymentRepository();
//# sourceMappingURL=paymentRepositories.js.map