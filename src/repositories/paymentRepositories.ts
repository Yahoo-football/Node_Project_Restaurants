import { type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type PaymentRecord } from '../models/paymentModel.js';

interface PaymentRow extends RowDataPacket, PaymentRecord {}

class PaymentRepository {
  public async findById(id: number): Promise<PaymentRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<PaymentRow[]>('SELECT * FROM payments WHERE id = ? LIMIT 1', [id]);

    return rows[0] ?? null;
  }

  public async findByOrderId(orderId: number): Promise<PaymentRecord[]> {
    const [rows] = await database
      .getPool()
      .execute<PaymentRow[]>('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC', [orderId]);

    return rows;
  }
}

export default new PaymentRepository();
