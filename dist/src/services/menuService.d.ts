import { type CategoryResponse } from '../models/categoryModel.js';
import { type MenuItemQueryOptions, type MenuItemResponse, type PaginatedResult } from '../models/menuModel.js';
declare class MenuService {
    getCategories(): Promise<CategoryResponse[]>;
    getMenuItems(options: MenuItemQueryOptions): Promise<PaginatedResult<MenuItemResponse>>;
    getMenuItemById(id: number): Promise<MenuItemResponse>;
    private mapMenuItem;
}
declare const _default: MenuService;
export default _default;
//# sourceMappingURL=menuService.d.ts.map