import { User } from './userModel.js';
export class Staff extends User {
    staffData;
    constructor(staffData) {
        super(staffData);
        this.staffData = staffData;
    }
    toPublicObject() {
        return {
            ...super.toPublicObject(),
            position: this.staffData.position,
            department: this.staffData.department,
            salary: this.staffData.salary === null ? null : Number(this.staffData.salary),
        };
    }
}
//# sourceMappingURL=staffModel.js.map