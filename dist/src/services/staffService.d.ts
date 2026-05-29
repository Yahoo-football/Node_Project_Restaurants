import { type PublicStaff, type StaffCreateInput, type StaffUpdateInput } from '../models/staffModel.js';
declare class StaffService {
    getAllStaff(): Promise<PublicStaff[]>;
    getStaffById(id: number): Promise<PublicStaff>;
    createStaff(data: StaffCreateInput): Promise<PublicStaff>;
    updateStaff(id: number, data: StaffUpdateInput): Promise<PublicStaff>;
    deleteStaff(id: number): Promise<void>;
    private validateCreateInput;
    private validateUpdateInput;
    private isValidEmail;
    private validateId;
    private hashPassword;
}
declare const _default: StaffService;
export default _default;
//# sourceMappingURL=staffService.d.ts.map