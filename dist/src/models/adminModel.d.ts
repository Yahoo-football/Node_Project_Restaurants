import { type PublicUser, type UserRole } from './userModel.js';
import { type OrderStatus } from './orderModel.js';
export interface AdminCreateUserInput {
    name: string;
    email: string;
    password: string;
    role: Extract<UserRole, 'admin' | 'staff'>;
    phone?: string;
}
export interface AdminUpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    role?: Extract<UserRole, 'admin' | 'staff'>;
    phone?: string | null;
}
export interface AdminUsersResponse {
    users: PublicUser[];
}
export interface DashboardSummary {
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    failedPayments: number;
}
export interface UpdateOrderStatusByAdminInput {
    status: OrderStatus;
    staffId?: number | null;
}
//# sourceMappingURL=adminModel.d.ts.map