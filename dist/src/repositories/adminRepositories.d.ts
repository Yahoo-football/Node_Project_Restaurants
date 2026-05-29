import { type DashboardSummary } from '../models/adminModel.js';
import { type AdminCreateUserInput, type AdminUpdateUserInput } from '../models/adminModel.js';
import { type UserRecord } from '../models/userModel.js';
declare class AdminRepository {
    findAllUsers(): Promise<UserRecord[]>;
    findUserById(id: number): Promise<UserRecord | null>;
    findUserByEmail(email: string): Promise<UserRecord | null>;
    createUser(data: AdminCreateUserInput & {
        password: string;
    }): Promise<UserRecord>;
    updateUser(id: number, data: AdminUpdateUserInput & {
        password?: string;
    }): Promise<UserRecord>;
    deleteUser(id: number): Promise<void>;
    getDashboardSummary(): Promise<DashboardSummary>;
}
declare const _default: AdminRepository;
export default _default;
//# sourceMappingURL=adminRepositories.d.ts.map