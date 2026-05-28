import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type CategoryRecord, type CreateCategoryInput, type UpdateCategoryInput } from '../models/categoryModel.js';

interface CategoryRow extends RowDataPacket, CategoryRecord {}

class CategoryRepository {
  public async findAll(): Promise<CategoryRecord[]> {
    const [rows] = await database
      .getPool()
      .execute<CategoryRow[]>('SELECT * FROM categories ORDER BY name ASC');

    return rows;
  }

  public async findById(id: number): Promise<CategoryRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<CategoryRow[]>('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);

    return rows[0] ?? null;
  }

  public async findByName(name: string): Promise<CategoryRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<CategoryRow[]>('SELECT * FROM categories WHERE name = ? LIMIT 1', [name]);

    return rows[0] ?? null;
  }

  public async create(data: CreateCategoryInput): Promise<CategoryRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [data.name, data.description ?? null],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Unable to load created category');
    }

    return created;
  }

  public async update(id: number, data: UpdateCategoryInput): Promise<CategoryRecord> {
    const updates: string[] = [];
    const values: Array<string | number | null> = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (updates.length > 0) {
      values.push(id);
      await database
        .getPool()
        .execute<ResultSetHeader>(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Category not found');
    }

    return updated;
  }

  public async delete(id: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
  }
}

export default new CategoryRepository();
