import { type MenuItemQueryOptions, type MenuItemRecord } from '../models/menuModel.js';
import { type CategoryRecord } from '../models/categoryModel.js';
declare class MenuRepository {
    findAllCategories(): Promise<CategoryRecord[]>;
    findMenuItems(options: MenuItemQueryOptions): Promise<{
        items: MenuItemRecord[];
        totalItems: number;
    }>;
    findMenuItemById(id: number): Promise<MenuItemRecord | null>;
}
declare const _default: MenuRepository;
export default _default;
//# sourceMappingURL=menuRepositories.d.ts.map