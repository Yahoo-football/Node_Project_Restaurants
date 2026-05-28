import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type OrderRecord, type UpdateOrderStatusInput } from '../models/orderModel.js';

interface OrderRow extends RowDataPacket, OrderRecord {}

class OrderRepository {
  public async findAll(): Promise<OrderRecord[]> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `
        SELECT
          o.*,
          customer.name AS customer_name,
          staff.name AS staff_name
        FROM orders o
        LEFT JOIN users customer ON customer.id = o.customer_id
        LEFT JOIN users staff ON staff.id = o.staff_id
        ORDER BY o.created_at DESC
      `,
    );

    return rows;
  }

  public async findById(id: number): Promise<OrderRecord | null> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `
        SELECT
          o.*,
          customer.name AS customer_name,
          staff.name AS staff_name
        FROM orders o
        LEFT JOIN users customer ON customer.id = o.customer_id
        LEFT JOIN users staff ON staff.id = o.staff_id
        WHERE o.id = ?
        LIMIT 1
      `,
      [id],
    );

    return rows[0] ?? null;
  }

  public async updateStatus(id: number, data: UpdateOrderStatusInput): Promise<OrderRecord> {
    await database.getPool().execute<ResultSetHeader>(
      'UPDATE orders SET status = ?, staff_id = ? WHERE id = ?',
      [data.status, data.staffId ?? null, id],
    );

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Order not found');
    }

    return updated;
  }
}

export default new OrderRepository();
