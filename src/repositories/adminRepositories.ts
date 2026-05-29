import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type DashboardSummary } from '../models/adminModel.js';
import { type AdminCreateUserInput, type AdminUpdateUserInput } from '../models/adminModel.js';
import { type UserRecord } from '../models/userModel.js';

interface UserRow extends RowDataPacket, UserRecord {}
interface DashboardRow extends RowDataPacket, DashboardSummary {}

class AdminRepository {
  public async findAllUsers(): Promise<UserRecord[]> {
    const [rows] = await database
      .getPool()
      .execute<UserRow[]>('SELECT * FROM users ORDER BY created_at DESC');

    return rows;
  }

  public async findUserById(id: number): Promise<UserRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<UserRow[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);

    return rows[0] ?? null;
  }

  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<UserRow[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

    return rows[0] ?? null;
  }

  public async createUser(data: AdminCreateUserInput & { password: string }): Promise<UserRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, data.password, data.role, data.phone ?? null],
    );

    const createdUser = await this.findUserById(result.insertId);
    if (!createdUser) {
      throw new Error('Unable to load created user');
    }

    return createdUser;
  }

  public async updateUser(id: number, data: AdminUpdateUserInput & { password?: string }): Promise<UserRecord> {
    const updates: string[] = [];
    const values: Array<string | number | null> = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }

    if (data.password !== undefined) {
      updates.push('password = ?');
      values.push(data.password);
    }

    if (data.role !== undefined) {
      updates.push('role = ?');
      values.push(data.role);
    }

    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone);
    }

    if (updates.length === 0) {
      const existingUser = await this.findUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      return existingUser;
    }

    values.push(id);

    await database
      .getPool()
      .execute<ResultSetHeader>(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    const updatedUser = await this.findUserById(id);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  public async deleteUser(id: number): Promise<void> {
    await database.getPool().execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    const [rows] = await database.getPool().execute<DashboardRow[]>(
      `
        SELECT
          COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0) AS totalSales,
          COUNT(DISTINCT o.id) AS totalOrders,
          COALESCE(SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END), 0) AS pendingOrders,
          COALESCE(SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END), 0) AS completedOrders,
          COALESCE(SUM(CASE WHEN p.status = 'failed' THEN 1 ELSE 0 END), 0) AS failedPayments
        FROM orders o
        LEFT JOIN payments p ON p.order_id = o.id
      `,
    );

    const summary = rows[0];
    if (!summary) {
      return { totalSales: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0, failedPayments: 0 };
    }

    return {
      totalSales: Number(summary.totalSales),
      totalOrders: Number(summary.totalOrders),
      pendingOrders: Number(summary.pendingOrders),
      completedOrders: Number(summary.completedOrders),
      failedPayments: Number(summary.failedPayments),
    };
  }
}

export default new AdminRepository();
