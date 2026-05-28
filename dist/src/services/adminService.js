import crypto from 'crypto';
import adminRepository from '../repositories/adminRepositories.js';
import {} from '../models/adminModel.js';
import { User } from '../models/userModel.js';
class AdminService {
    manageableRoles = ['admin', 'staff'];
    allowedRoles = ['admin', 'staff', 'customer'];
    async getUsers() {
        const users = await adminRepository.findAllUsers();
        return users.map((user) => new User(user).toPublicObject());
    }
    async getUserById(id) {
        const user = await adminRepository.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return new User(user).toPublicObject();
    }
    async createUser(data) {
        this.validateCreateInput(data);
        const existingUser = await adminRepository.findUserByEmail(data.email.toLowerCase().trim());
        if (existingUser) {
            throw new Error('Email is already registered');
        }
        const hashedPassword = await this.hashPassword(data.password);
        const sanitizedPhone = data.phone?.trim();
        const createdUser = await adminRepository.createUser({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            password: hashedPassword,
            role: data.role,
            ...(sanitizedPhone ? { phone: sanitizedPhone } : {}),
        });
        return new User(createdUser).toPublicObject();
    }
    async updateUser(id, data) {
        this.validateUserId(id);
        this.validateUpdateInput(data);
        const existingUser = await adminRepository.findUserById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const normalizedEmail = data.email?.toLowerCase().trim();
        if (normalizedEmail && normalizedEmail !== existingUser.email) {
            const emailOwner = await adminRepository.findUserByEmail(normalizedEmail);
            if (emailOwner && emailOwner.id !== id) {
                throw new Error('Email is already registered');
            }
        }
        const updatedUser = await adminRepository.updateUser(id, {
            ...(data.name !== undefined ? { name: data.name.trim() } : {}),
            ...(normalizedEmail ? { email: normalizedEmail } : {}),
            ...(data.password ? { password: await this.hashPassword(data.password) } : {}),
            ...(data.role !== undefined ? { role: data.role } : {}),
            ...(data.phone !== undefined ? { phone: data.phone === null ? null : data.phone.trim() } : {}),
        });
        return new User(updatedUser).toPublicObject();
    }
    async deleteUser(id) {
        this.validateUserId(id);
        const existingUser = await adminRepository.findUserById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        await adminRepository.deleteUser(id);
    }
    async getDashboardSummary() {
        return adminRepository.getDashboardSummary();
    }
    async getSalesSummary() {
        return adminRepository.getSalesSummary();
    }
    async getTopProducts() {
        return adminRepository.getTopProducts();
    }
    validateCreateInput(data) {
        if (!data.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!data.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!data.password || data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        if (!this.manageableRoles.includes(data.role)) {
            throw new Error('Admin can only create admin or staff accounts');
        }
    }
    validateUpdateInput(data) {
        if (data.role !== undefined && !this.allowedRoles.includes(data.role)) {
            throw new Error('Invalid role');
        }
        if (data.password !== undefined && data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }
    validateUserId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid user id');
        }
    }
    async hashPassword(password) {
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
export default new AdminService();
//# sourceMappingURL=adminService.js.map