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
  role?: UserRole;
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

export interface SalesSummary {
  period: string;
  revenue: number;
  orders: number;
}

export interface TopProductSummary {
  menuItemId: number;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface UpdateOrderStatusByAdminInput {
  status: OrderStatus;
  staffId?: number | null;
}
