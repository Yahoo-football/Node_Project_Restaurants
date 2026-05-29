import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/customerModel.js';
class CustomerRepository {
    async findCartByCustomerId(customerId) {
        const [rows] = await database
            .getPool()
            .execute('SELECT * FROM carts WHERE customer_id = ? LIMIT 1', [customerId]);
        return rows[0] ?? null;
    }
    async findCartById(id) {
        const [rows] = await database.getPool().execute('SELECT * FROM carts WHERE id = ? LIMIT 1', [id]);
        return rows[0] ?? null;
    }
    async createCart(customerId) {
        const [result] = await database.getPool().execute('INSERT INTO carts (customer_id) VALUES (?)', [customerId]);
        const cartId = result.insertId;
        const cart = await this.findCartById(cartId);
        if (!cart) {
            throw new Error('Unable to create cart');
        }
        return cart;
    }
    async findCartItemsByCartId(cartId) {
        const [rows] = await database.getPool().execute(`
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
    `, [cartId]);
        return rows;
    }
    async findCartItemByCartIdAndMenuItemId(cartId, menuItemId) {
        const [rows] = await database.getPool().execute(`
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
    `, [cartId, menuItemId]);
        return rows[0] ?? null;
    }
    async findCartItemById(itemId) {
        const [rows] = await database.getPool().execute(`
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
    `, [itemId]);
        return rows[0] ?? null;
    }
    async insertCartItem(cartId, menuItemId, quantity) {
        await database.getPool().execute('INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)', [cartId, menuItemId, quantity]);
    }
    async updateCartItemQuantity(itemId, quantity) {
        await database
            .getPool()
            .execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    }
    async deleteCartItem(itemId) {
        await database.getPool().execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
    }
    async clearCartItems(cartId) {
        await database.getPool().execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }
}
export default new CustomerRepository();
//# sourceMappingURL=customerRepositories.js.map