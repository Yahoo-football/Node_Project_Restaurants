import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/paymentModel.js';
class PaymentRepository {
    async createPayment(data) {
        const [result] = await database.getPool().execute('INSERT INTO payments (order_id, payment_method, payment_status, amount) VALUES (?, ?, ?, ?)', [data.orderId, data.paymentMethod, data.paymentStatus, data.amount]);
        const paymentId = result.insertId;
        const [rows] = await database.getPool().execute(`
      SELECT p.*, o.customer_id
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.id = ?
      LIMIT 1
    `, [paymentId]);
        const payment = rows[0];
        if (!payment) {
            throw new Error('Unable to create payment');
        }
        return payment;
    }
    async findPaymentById(paymentId) {
        const [rows] = await database.getPool().execute(`
      SELECT p.*, o.customer_id
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.id = ?
      LIMIT 1
    `, [paymentId]);
        return rows[0] ?? null;
    }
}
export default new PaymentRepository();
//# sourceMappingURL=paymentRepositories.js.map