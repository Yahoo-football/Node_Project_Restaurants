import { type PublicUser, type UserRole } from './userModel.js';

export interface AdminCreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'admin'>;
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
