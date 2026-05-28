export interface MenuItemRecord {
    id: number;
    category_id: number;
    category_name?: string | null;
    name: string;
    description: string | null;
    price: number;
    is_available: number | boolean;
    created_at: Date;
}
export interface PublicMenuItem {
    id: number;
    categoryId: number;
    categoryName: string | null;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
    createdAt: Date;
}
export interface CreateMenuItemInput {
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    isAvailable?: boolean;
}
export interface UpdateMenuItemInput {
    categoryId?: number;
    name?: string;
    description?: string | null;
    price?: number;
    isAvailable?: boolean;
}
export declare class MenuItem {
    private readonly data;
    constructor(data: MenuItemRecord);
    toPublicObject(): PublicMenuItem;
}
//# sourceMappingURL=menuModel.d.ts.map