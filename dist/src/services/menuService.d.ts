import { type CreateMenuItemInput, type PublicMenuItem, type UpdateMenuItemInput } from '../models/menuModel.js';
declare class MenuService {
    getMenuItems(): Promise<PublicMenuItem[]>;
    createMenuItem(data: CreateMenuItemInput): Promise<PublicMenuItem>;
    updateMenuItem(id: number, data: UpdateMenuItemInput): Promise<PublicMenuItem>;
    deleteMenuItem(id: number): Promise<void>;
    private validateCreateInput;
    private ensureCategoryExists;
    private validateId;
}
declare const _default: MenuService;
export default _default;
//# sourceMappingURL=menuService.d.ts.map