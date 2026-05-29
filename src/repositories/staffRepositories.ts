import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import database from '../config/db.js';
import { type StaffCreateInput, type StaffRecord, type StaffUpdateInput } from '../models/staffModel.js';

interface StaffRow extends RowDataPacket, StaffRecord { }

class StaffRepository {
    public async findAllStaff(): Promise<StaffRecord[]> {
        const [rows] = await database
            .getPool()
            .execute<StaffRow[]>('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', ['staff']);

        return rows;
    }

    public async findStaffById(id: number): Promise<StaffRecord | null> {
        const [rows] = await database
            .getPool()
            .execute<StaffRow[]>('SELECT * FROM users WHERE id = ? AND role = ? LIMIT 1', [id, 'staff']);

        return rows[0] ?? null;
    }

    public async findStaffByEmail(email: string): Promise<StaffRecord | null> {
        const [rows] = await database
            .getPool()
            .execute<StaffRow[]>('SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1', [email, 'staff']);

        return rows[0] ?? null;
    }

    public async findUserByEmail(email: string): Promise<StaffRecord | null> {
        const [rows] = await database
            .getPool()
            .execute<StaffRow[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

        return rows[0] ?? null;
    }

    public async createStaff(data: StaffCreateInput & { password: string }): Promise<StaffRecord> {
        const [result] = await database.getPool().execute<ResultSetHeader>(
            'INSERT INTO users (name, email, password, role, phone, position, department, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.name,
                data.email,
                data.password,
                'staff',
                data.phone ?? null,
                data.position ?? null,
                data.department ?? null,
                data.salary ?? null,
            ],
        );

        const staff = await this.findStaffById(result.insertId);
        if (!staff) {
            throw new Error('Unable to load created staff');
        }

        return staff;
    }

    public async updateStaff(id: number, data: StaffUpdateInput & { password?: string }): Promise<StaffRecord> {
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

        if (data.phone !== undefined) {
            updates.push('phone = ?');
            values.push(data.phone);
        }

        if (data.position !== undefined) {
            updates.push('position = ?');
            values.push(data.position ?? null);
        }

        if (data.department !== undefined) {
            updates.push('department = ?');
            values.push(data.department ?? null);
        }

        if (data.salary !== undefined) {
            updates.push('salary = ?');
            values.push(data.salary ?? null);
        }

        if (updates.length === 0) {
            const existingStaff = await this.findStaffById(id);
            if (!existingStaff) {
                throw new Error('Staff member not found');
            }

            return existingStaff;
        }

        values.push(id);

        await database
            .getPool()
            .execute<ResultSetHeader>(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND role = ?`,
                [...values, 'staff'],
            );

        const updatedStaff = await this.findStaffById(id);
        if (!updatedStaff) {
            throw new Error('Staff member not found');
        }

        return updatedStaff;
    }

    public async deleteStaff(id: number): Promise<void> {
        await database
            .getPool()
            .execute<ResultSetHeader>('DELETE FROM users WHERE id = ? AND role = ?', [id, 'staff']);
    }
}

export default new StaffRepository();
