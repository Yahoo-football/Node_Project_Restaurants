import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/menuModel.js';
class MenuRepository {
    async findAll() {
        const [rows] = await database.getPool().execute(`
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON c.id = m.category_id
        ORDER BY c.name ASC, m.name ASC
      `);
        return rows;
    }
    async findById(id) {
        const [rows] = await database.getPool().execute(`
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON c.id = m.category_id
        WHERE m.id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await database.getPool().execute(`
        INSERT INTO menu_items (category_id, name, description, price, is_available)
        VALUES (?, ?, ?, ?, ?)
      `, [data.categoryId, data.name, data.description ?? null, data.price, data.isAvailable ?? true]);
        const created = await this.findById(result.insertId);
        if (!created) {
            throw new Error('Unable to load created menu item');
        }
        return created;
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        if (data.categoryId !== undefined) {
            updates.push('category_id = ?');
            values.push(data.categoryId);
        }
        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.price !== undefined) {
            updates.push('price = ?');
            values.push(data.price);
        }
        if (data.isAvailable !== undefined) {
            updates.push('is_available = ?');
            values.push(data.isAvailable);
        }
        if (updates.length > 0) {
            values.push(id);
            await database
                .getPool()
                .execute(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`, values);
        }
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Menu item not found');
        }
        return updated;
    }
    async delete(id) {
        await database.getPool().execute('DELETE FROM menu_items WHERE id = ?', [id]);
    }
}
export default new MenuRepository();
//# sourceMappingURL=menuRepositories.js.map