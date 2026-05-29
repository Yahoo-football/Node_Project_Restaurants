import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type OrderRecord } from '../models/orderModel.js';

interface OrderRow extends RowDataPacket, OrderRecord {
  order_item_id?: number;
  menu_item_id?: number;
  quantity?: number;
  price?: number;
  item_name?: string;
}

interface OrderItemInsert {
  menuItemId: number;
  quantity: number;
  price: number;
}

class OrderRepository {
  public async createOrder(customerId: number, totalPrice: number, notes: string | null): Promise<OrderRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO orders (customer_id, total_price, notes) VALUES (?, ?, ?)',
      [customerId, totalPrice, notes],
    );

    const orderId = result.insertId;
    const order = await this.findOrderRecordById(orderId);
    if (!order) {
      throw new Error('Unable to create order');
    }

    return order;
  }

  public async createOrderItems(orderId: number, items: OrderItemInsert[]): Promise<void> {
    if (!items.length) {
      return;
    }

    const values = items.map((item) => [orderId, item.menuItemId, item.quantity, item.price]);
    await database.getPool().query<ResultSetHeader>(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
      [values],
    );
  }

  public async findOrdersByCustomerId(customerId: number): Promise<OrderRow[]> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `
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
    `,
      [customerId],
    );

    return rows;
  }

  public async findOrderById(orderId: number): Promise<OrderRow[]> {
    const [rows] = await database.getPool().execute<OrderRow[]>(
      `
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
    `,
      [orderId],
    );

    return rows;
  }

  public async findOrderRecordById(orderId: number): Promise<OrderRecord | null> {
    const [rows] = await database.getPool().execute<OrderRow[]>('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    return rows[0] ?? null;
  }

  public async updateOrderStatus(orderId: number, status: OrderRecord['status']): Promise<OrderRecord> {
    await database.getPool().execute<ResultSetHeader>('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    const order = await this.findOrderRecordById(orderId);
    if (!order) {
      throw new Error('Unable to update order status');
    }
    return order;
  }
}

export default new OrderRepository();

