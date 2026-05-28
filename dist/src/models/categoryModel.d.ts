export interface CategoryRecord {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
}
export interface PublicCategory {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
}
export interface CreateCategoryInput {
    name: string;
    description?: string;
}
export interface UpdateCategoryInput {
    name?: string;
    description?: string | null;
}
export declare class Category {
    private readonly data;
    constructor(data: CategoryRecord);
    toPublicObject(): PublicCategory;
}
//# sourceMappingURL=categoryModel.d.ts.map