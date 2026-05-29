export class MenuItem {
    data;
    constructor(data) {
        this.data = data;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            name: this.data.name,
            description: this.data.description,
            price: Number(this.data.price),
            image: this.data.image ?? null,
            categoryId: this.data.category_id ?? null,
            status: this.data.status ?? null,
            createdAt: this.data.created_at,
        };
    }
}
//# sourceMappingURL=menuModel.js.map