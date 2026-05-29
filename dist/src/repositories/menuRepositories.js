import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/menuModel.js';
class MenuRepository {
    async findAll() {
        const [rows] = await database.getPool().execute(`
        SELECT *
        FROM menu_items
        ORDER BY name ASC
      `);
        return rows;
    }
    async findById(id) {
        const [rows] = await database.getPool().execute(`
        SELECT *
        FROM menu_items
        WHERE id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
    async create(data) {
        const [result] = await database.getPool().execute(`
        INSERT INTO menu_items (name, description, price, image, category_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
            data.name,
            data.description ?? null,
            data.price,
            data.image ?? null,
            data.categoryId ?? null,
            data.status ?? null,
        ]);
        const created = await this.findById(result.insertId);
        if (!created) {
            throw new Error('Unable to load created menu item');
        }
        return created;
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.image !== undefined) {
            updates.push('image = ?');
            values.push(data.image);
        }
        if (data.categoryId !== undefined) {
            updates.push('category_id = ?');
            values.push(data.categoryId);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.price !== undefined) {
            updates.push('price = ?');
            values.push(data.price);
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