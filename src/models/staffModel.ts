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

export class Staff extends User {
    constructor(private readonly staffData: StaffRecord) {
        super(staffData);
    }

    public override toPublicObject(): PublicStaff {
        return {
            ...super.toPublicObject(),
            position: this.staffData.position,
            department: this.staffData.department,
            salary: this.staffData.salary === null ? null : Number(this.staffData.salary),
        };
    }
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
