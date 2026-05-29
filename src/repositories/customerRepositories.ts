import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type CartRecord } from '../models/customerModel.js';

interface CartRow extends RowDataPacket, CartRecord {}
interface CartItemRow extends RowDataPacket {
  id: number;
  cart_id: number;
  menu_item_id: number;
  quantity: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category_name: string | null;
}

class CustomerRepository {
  public async findCartByCustomerId(customerId: number): Promise<CartRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<CartRow[]>('SELECT * FROM carts WHERE customer_id = ? LIMIT 1', [customerId]);

    return rows[0] ?? null;
  }

  public async findCartById(id: number): Promise<CartRecord | null> {
    const [rows] = await database.getPool().execute<CartRow[]>('SELECT * FROM carts WHERE id = ? LIMIT 1', [id]);
    return rows[0] ?? null;
  }

  public async createCart(customerId: number): Promise<CartRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO carts (customer_id) VALUES (?)',
      [customerId],
    );

    const cartId = result.insertId;
    const cart = await this.findCartById(cartId);
    if (!cart) {
      throw new Error('Unable to create cart');
    }

    return cart;
  }

  public async findCartItemsByCartId(cartId: number): Promise<CartItemRow[]> {
    const [rows] = await database.getPool().execute<CartItemRow[]>(
      `
      SELECT
        ci.id,
        ci.cart_id,
        ci.menu_item_id,
        ci.quantity,
        mi.name,
        mi.description,
        mi.price,
        mi.image,
        c.name AS category_name
      FROM cart_items ci
      JOIN menu_items mi ON ci.menu_item_id = mi.id
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE ci.cart_id = ?
    `,
      [cartId],
    );

    return rows;
  }

  public async findCartItemByCartIdAndMenuItemId(cartId: number, menuItemId: number): Promise<CartItemRow | null> {
    const [rows] = await database.getPool().execute<CartItemRow[]>(
      `
      SELECT
        ci.id,
        ci.cart_id,
        ci.menu_item_id,
        ci.quantity,
        mi.name,
        mi.description,
        mi.price,
        mi.image,
        c.name AS category_name
      FROM cart_items ci
      JOIN menu_items mi ON ci.menu_item_id = mi.id
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE ci.cart_id = ? AND ci.menu_item_id = ?
      LIMIT 1
    `,
      [cartId, menuItemId],
    );

    return rows[0] ?? null;
  }

  public async findCartItemById(itemId: number): Promise<CartItemRow | null> {
    const [rows] = await database.getPool().execute<CartItemRow[]>(
      `
      SELECT
        ci.id,
        ci.cart_id,
        ci.menu_item_id,
        ci.quantity,
        mi.name,
        mi.description,
        mi.price,
        mi.image,
        c.name AS category_name
      FROM cart_items ci
      JOIN menu_items mi ON ci.menu_item_id = mi.id
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE ci.id = ?
      LIMIT 1
    `,
      [itemId],
    );

    return rows[0] ?? null;
  }

  public async insertCartItem(cartId: number, menuItemId: number, quantity: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)',
      [cartId, menuItemId, quantity],
    );
  }

  public async updateCartItemQuantity(itemId: number, quantity: number): Promise<void> {
    await database
      .getPool()
      .execute<ResultSetHeader>('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
  }

  public async deleteCartItem(itemId: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>('DELETE FROM cart_items WHERE id = ?', [itemId]);
  }

  public async clearCartItems(cartId: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}

export default new CustomerRepository();
