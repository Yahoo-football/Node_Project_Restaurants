export class MenuItem {
    data;
    constructor(data) {
        this.data = data;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            categoryId: this.data.category_id,
            categoryName: this.data.category_name ?? null,
            name: this.data.name,
            description: this.data.description,
            price: Number(this.data.price),
            isAvailable: Boolean(this.data.is_available),
            createdAt: this.data.created_at,
        };
    }
}
//# sourceMappingURL=menuModel.js.map