import { type StaffCreateInput, type StaffRecord, type StaffUpdateInput } from '../models/staffModel.js';
declare class StaffRepository {
    findAllStaff(): Promise<StaffRecord[]>;
    findStaffById(id: number): Promise<StaffRecord | null>;
    findStaffByEmail(email: string): Promise<StaffRecord | null>;
    findUserByEmail(email: string): Promise<StaffRecord | null>;
    createStaff(data: StaffCreateInput & {
        password: string;
    }): Promise<StaffRecord>;
    updateStaff(id: number, data: StaffUpdateInput & {
        password?: string;
    }): Promise<StaffRecord>;
    deleteStaff(id: number): Promise<void>;
}
declare const _default: StaffRepository;
export default _default;
//# sourceMappingURL=staffRepositories.d.ts.map