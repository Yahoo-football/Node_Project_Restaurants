import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type PaymentMethod, type PaymentStatus, type PaymentRecord } from '../models/paymentModel.js';

interface PaymentRow extends RowDataPacket, PaymentRecord {
  customer_id: number;
}

class PaymentRepository {
  public async createPayment(data: {
    orderId: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    amount: number;
  }): Promise<PaymentRow> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO payments (order_id, payment_method, payment_status, amount) VALUES (?, ?, ?, ?)',
      [data.orderId, data.paymentMethod, data.paymentStatus, data.amount],
    );

    const paymentId = result.insertId;
    const [rows] = await database.getPool().execute<PaymentRow[]>(
      `
      SELECT p.*, o.customer_id
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.id = ?
      LIMIT 1
    `,
      [paymentId],
    );

    const payment = rows[0];
    if (!payment) {
      throw new Error('Unable to create payment');
    }

    return payment;
  }

  public async findPaymentById(paymentId: number): Promise<PaymentRow | null> {
    const [rows] = await database.getPool().execute<PaymentRow[]>(
      `
      SELECT p.*, o.customer_id
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.id = ?
      LIMIT 1
    `,
      [paymentId],
    );

    return rows[0] ?? null;
  }
}

export default new PaymentRepository();

