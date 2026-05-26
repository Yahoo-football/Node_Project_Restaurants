import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type RegisterUserInput, type UserRecord } from '../models/userModel.js';

interface UserRow extends RowDataPacket, UserRecord {}

class AuthRepository {
  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<UserRow[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

    return rows[0] ?? null;
  }

  public async findUserById(id: number): Promise<UserRecord | null> {
    const [rows] = await database
      .getPool()
      .execute<UserRow[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);

    return rows[0] ?? null;
  }

  public async createUser(data: RegisterUserInput & { password: string }): Promise<UserRecord> {
    const [result] = await database.getPool().execute<ResultSetHeader>(
      `
        INSERT INTO users (name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?)
      `,
      [data.name, data.email, data.password, data.role ?? 'customer', data.phone ?? null],
    );

    const user = await this.findUserById(result.insertId);

    if (!user) {
      throw new Error('Unable to load created user');
    }

    return user;
  }
}

export default new AuthRepository();
