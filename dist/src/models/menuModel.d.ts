export type MenuItemStatus = 'available' | 'unavailable';
export interface MenuItemRecord {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category_id: number | null;
    status: MenuItemStatus;
    created_at: Date;
    category_name?: string | null;
}
export interface MenuItemResponse {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    categoryId: number | null;
    categoryName: string | null;
    status: MenuItemStatus;
    createdAt: Date;
}
export interface MenuItemQueryOptions {
    categoryId?: number | undefined;
    search?: string | undefined;
    status?: MenuItemStatus | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: 'ASC' | 'DESC' | undefined;
}
export interface PaginatedResult<T> {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
//# sourceMappingURL=menuModel.d.ts.map