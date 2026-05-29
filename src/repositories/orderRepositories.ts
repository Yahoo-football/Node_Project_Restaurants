import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type OrderItemRecord, type OrderRecord, type OrderStatus } from '../models/orderModel.js';

interface OrderRow extends RowDataPacket, OrderRecord {}
interface OrderItemRow extends RowDataPacket, OrderItemRecord {}

class OrderRepository {
  public async findAllOrders(): Promise<OrderRecord[]> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `SELECT
        orders.*,
        customers.name AS customer_name,
        staff.name AS staff_name
      FROM orders
      INNER JOIN users AS customers ON customers.id = orders.customer_id
      LEFT JOIN users AS staff ON staff.id = orders.staff_id
      ORDER BY orders.created_at DESC`,
    );

    return rows;
  }

  public async findOrderById(id: number): Promise<OrderRecord | null> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `SELECT
        orders.*,
        customers.name AS customer_name,
        staff.name AS staff_name
      FROM orders
      INNER JOIN users AS customers ON customers.id = orders.customer_id
      LEFT JOIN users AS staff ON staff.id = orders.staff_id
      WHERE orders.id = ?
      LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  public async findItemsByOrderIds(orderIds: number[]): Promise<OrderItemRecord[]> {
    if (orderIds.length === 0) {
      return [];
    }

    const placeholders = orderIds.map(() => '?').join(', ');
    const [rows] = await database.getPool().execute<OrderItemRow[]>(
      `SELECT
        order_items.*,
        menu_items.name AS menu_item_name
      FROM order_items
      INNER JOIN menu_items ON menu_items.id = order_items.menu_item_id
      WHERE order_items.order_id IN (${placeholders})
      ORDER BY order_items.id ASC`,
      orderIds,
    );

    return rows;
  }

  public async updateOrderStatus(id: number, status: OrderStatus, staffId: number | null): Promise<void> {
    await database.getPool().execute<ResultSetHeader>(
      'UPDATE orders SET status = ?, staff_id = ? WHERE id = ?',
      [status, staffId, id],
    );
  }
}

export default new OrderRepository();
