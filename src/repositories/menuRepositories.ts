import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type CreateMenuItemInput, type MenuItemRecord, type UpdateMenuItemInput } from '../models/menuModel.js';

interface MenuItemRow extends RowDataPacket, MenuItemRecord {}

class MenuRepository {
  public async findAll(): Promise<MenuItemRecord[]> {
    const [rows] = await database.getPool().execute<MenuItemRow[]>(
      `
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON c.id = m.category_id
        ORDER BY c.name ASC, m.name ASC
      `,
    );

    return rows;
  }

  public async findById(id: number): Promise<MenuItemRecord | null> {
    const [rows] = await database.getPool().execute<MenuItemRow[]>(
      `
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON c.id = m.category_id
        WHERE m.id = ?
        LIMIT 1
      `,
      [id],
    );

    return rows[0] ?? null;
  }

  public async create(data: CreateMenuItemInput): Promise<MenuItemRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      `
        INSERT INTO menu_items (category_id, name, description, price, is_available)
        VALUES (?, ?, ?, ?, ?)
      `,
      [data.categoryId, data.name, data.description ?? null, data.price, data.isAvailable ?? true],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Unable to load created menu item');
    }

    return created;
  }

  public async update(id: number, data: UpdateMenuItemInput): Promise<MenuItemRecord> {
    const updates: string[] = [];
    const values: Array<string | number | boolean | null> = [];

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
        .execute<ResultSetHeader>(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Menu item not found');
    }

    return updated;
  }

  public async delete(id: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>('DELETE FROM menu_items WHERE id = ?', [id]);
  }
}

export default new MenuRepository();
