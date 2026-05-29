export interface MenuItemRecord {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category_id: number | null;
    status: string | null;
    created_at: Date;
}
export interface PublicMenuItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    categoryId: number | null;
    status: string | null;
    createdAt: Date;
}
export interface CreateMenuItemInput {
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId?: number;
    status?: string;
}
export interface UpdateMenuItemInput {
    name?: string;
    description?: string | null;
    price?: number;
    image?: string | null;
    categoryId?: number | null;
    status?: string | null;
}
export declare class MenuItem {
    private readonly data;
    constructor(data: MenuItemRecord);
    toPublicObject(): PublicMenuItem;
}
//# sourceMappingURL=menuModel.d.ts.map