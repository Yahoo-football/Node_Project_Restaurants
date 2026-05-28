import { type AdminCreateUserInput, type AdminUpdateUserInput, type DashboardSummary, type SalesSummary, type TopProductSummary } from '../models/adminModel.js';
import { type PublicUser } from '../models/userModel.js';
declare class AdminService {
    private readonly manageableRoles;
    private readonly allowedRoles;
    getUsers(): Promise<PublicUser[]>;
    getUserById(id: number): Promise<PublicUser>;
    createUser(data: AdminCreateUserInput): Promise<PublicUser>;
    updateUser(id: number, data: AdminUpdateUserInput): Promise<PublicUser>;
    deleteUser(id: number): Promise<void>;
    getDashboardSummary(): Promise<DashboardSummary>;
    getSalesSummary(): Promise<SalesSummary[]>;
    getTopProducts(): Promise<TopProductSummary[]>;
    private validateCreateInput;
    private validateUpdateInput;
    private validateUserId;
    private hashPassword;
}
declare const _default: AdminService;
export default _default;
//# sourceMappingURL=adminService.d.ts.map