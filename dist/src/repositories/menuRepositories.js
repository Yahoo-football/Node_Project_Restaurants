import {} from 'mysql2/promise';
import database from '../config/db.js';
import {} from '../models/menuModel.js';
import {} from '../models/categoryModel.js';
class MenuRepository {
    async findAllCategories() {
        const [rows] = await database.getPool().execute('SELECT * FROM categories ORDER BY name');
        return rows;
    }
    async findMenuItems(options) {
        const filters = [];
        const values = [];
        if (options.categoryId !== undefined) {
            filters.push('m.category_id = ?');
            values.push(options.categoryId);
        }
        if (options.search) {
            filters.push('m.name LIKE ?');
            values.push(`%${options.search}%`);
        }
        if (options.status) {
            filters.push('m.status = ?');
            values.push(options.status);
        }
        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const countQuery = `SELECT COUNT(*) as total FROM menu_items m ${whereClause}`;
        const [countRows] = await database.getPool().execute(countQuery, values);
        const totalItems = Number(countRows[0].total);
        const orderBy = ['price', 'name', 'created_at'].includes(options.sortBy ?? '')
            ? `m.${options.sortBy}`
            : 'm.created_at';
        const sortOrder = options.sortOrder === 'ASC' ? 'ASC' : 'DESC';
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const offset = options.offset ?? 0;
        const dataQuery = `
      SELECT m.*, c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy} ${sortOrder}
      LIMIT ?
      OFFSET ?
    `;
        const [rows] = await database.getPool().execute(dataQuery, [...values, limit, offset]);
        return { items: rows, totalItems };
    }
    async findMenuItemById(id) {
        const [rows] = await database
            .getPool()
            .execute(`
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.id = ?
        LIMIT 1
      `, [id]);
        return rows[0] ?? null;
    }
}
export default new MenuRepository();
//# sourceMappingURL=menuRepositories.js.map