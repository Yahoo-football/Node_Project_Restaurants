export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string | null;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  createdAt: Date;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

export class User {
  constructor(private readonly data: UserRecord) {}

  public get id(): number {
    return this.data.id;
  }

  public get email(): string {
    return this.data.email;
  }

  public get password(): string {
    return this.data.password;
  }

  public get role(): UserRole {
    return this.data.role;
  }

  public toPublicObject(): PublicUser {
    return {
      id: this.data.id,
      name: this.data.name,
      email: this.data.email,
      role: this.data.role,
      phone: this.data.phone,
      createdAt: this.data.created_at,
    };
  }
}
