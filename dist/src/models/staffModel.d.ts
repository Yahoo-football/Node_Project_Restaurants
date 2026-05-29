import { type PublicUser, User, type UserRecord } from './userModel.js';
export interface StaffCreateInput {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    position?: string | null;
    department?: string | null;
    salary?: number;
}
export interface StaffRecord extends UserRecord {
    position: string | null;
    department: string | null;
    salary: number | string | null;
}
export interface PublicStaff extends PublicUser {
    position: string | null;
    department: string | null;
    salary: number | null;
}
export declare class Staff extends User {
    private readonly staffData;
    constructor(staffData: StaffRecord);
    toPublicObject(): PublicStaff;
}
export interface StaffUpdateInput {
    name?: string;
    email?: string;
    password?: string;
    phone?: string | null;
    position?: string | null;
    department?: string | null;
    salary?: number;
}
//# sourceMappingURL=staffModel.d.ts.map