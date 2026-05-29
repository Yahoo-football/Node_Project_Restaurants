import crypto from 'crypto';
import staffRepository from '../repositories/staffRepositories.js';
import { type PublicStaff, Staff, type StaffCreateInput, type StaffUpdateInput } from '../models/staffModel.js';

class StaffService {
    public async getAllStaff(): Promise<PublicStaff[]> {
        const staffRecords = await staffRepository.findAllStaff();
        return staffRecords.map((staff) => new Staff(staff).toPublicObject());
    }

    public async getStaffById(id: number): Promise<PublicStaff> {
        this.validateId(id);
        const staff = await staffRepository.findStaffById(id);
        if (!staff) {
            throw new Error('Staff member not found');
        }

        return new Staff(staff).toPublicObject();
    }

    public async createStaff(data: StaffCreateInput): Promise<PublicStaff> {
        this.validateCreateInput(data);

        const normalizedEmail = data.email.toLowerCase().trim();
        const existingUser = await staffRepository.findUserByEmail(normalizedEmail);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const hashedPassword = await this.hashPassword(data.password);
        const sanitizedPhone = data.phone?.trim() ?? null;
        const sanitizedPosition = data.position?.trim() ?? null;
        const sanitizedDepartment = data.department?.trim() ?? null;

        const createdStaff = await staffRepository.createStaff({
            name: data.name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: sanitizedPhone,
            position: sanitizedPosition,
            department: sanitizedDepartment,
            ...(data.salary !== undefined ? { salary: data.salary } : {}),
        });

        return new Staff(createdStaff).toPublicObject();
    }

    public async updateStaff(id: number, data: StaffUpdateInput): Promise<PublicStaff> {
        this.validateId(id);
        this.validateUpdateInput(data);

        const existingStaff = await staffRepository.findStaffById(id);
        if (!existingStaff) {
            throw new Error('Staff member not found');
        }

        const normalizedEmail = data.email?.toLowerCase().trim();
        if (normalizedEmail && normalizedEmail !== existingStaff.email) {
            const emailOwner = await staffRepository.findStaffByEmail(normalizedEmail);
            if (emailOwner && emailOwner.id !== id) {
                throw new Error('Email is already registered');
            }
        }

        const updatedStaff = await staffRepository.updateStaff(id, {
            ...(data.name !== undefined ? { name: data.name.trim() } : {}),
            ...(normalizedEmail ? { email: normalizedEmail } : {}),
            ...(data.password ? { password: await this.hashPassword(data.password) } : {}),
            ...(data.phone !== undefined ? { phone: data.phone === null ? null : data.phone.trim() } : {}),
            ...(data.position !== undefined ? { position: data.position?.trim() ?? null } : {}),
            ...(data.department !== undefined ? { department: data.department?.trim() ?? null } : {}),
            ...(data.salary !== undefined ? { salary: data.salary } : {}),
        });

        return new Staff(updatedStaff).toPublicObject();
    }

    public async deleteStaff(id: number): Promise<void> {
        this.validateId(id);
        const existingStaff = await staffRepository.findStaffById(id);
        if (!existingStaff) {
            throw new Error('Staff member not found');
        }

        await staffRepository.deleteStaff(id);
    }

    private validateCreateInput(data: StaffCreateInput): void {
        if (!data.name?.trim()) {
            throw new Error('Name is required');
        }

        if (!data.email?.trim()) {
            throw new Error('Email is required');
        }

        if (!this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        if (!data.password || data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (data.salary !== undefined && (!Number.isFinite(data.salary) || data.salary < 0)) {
            throw new Error('Salary must be a valid non-negative number');
        }
    }

    private validateUpdateInput(data: StaffUpdateInput): void {
        if (data.name !== undefined && !data.name.trim()) {
            throw new Error('Name cannot be empty');
        }

        if (data.email !== undefined && !this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        if (data.password !== undefined && data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (data.salary !== undefined && (!Number.isFinite(data.salary) || data.salary < 0)) {
            throw new Error('Salary must be a valid non-negative number');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validateId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid staff id');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = crypto.randomBytes(16).toString('hex');

        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 64, (error, derivedKey) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(`${salt}:${derivedKey.toString('hex')}`);
            });
        });
    }
}

export default new StaffService();
