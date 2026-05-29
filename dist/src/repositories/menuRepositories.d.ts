import { type CreateMenuItemInput, type MenuItemRecord, type UpdateMenuItemInput } from '../models/menuModel.js';
declare class MenuRepository {
    findAll(): Promise<MenuItemRecord[]>;
    findById(id: number): Promise<MenuItemRecord | null>;
    create(data: CreateMenuItemInput): Promise<MenuItemRecord>;
    update(id: number, data: UpdateMenuItemInput): Promise<MenuItemRecord>;
    delete(id: number): Promise<void>;
}
declare const _default: MenuRepository;
export default _default;
//# sourceMappingURL=menuRepositories.d.ts.map