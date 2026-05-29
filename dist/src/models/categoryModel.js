export class Category {
    data;
    constructor(data) {
        this.data = data;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            name: this.data.name,
            description: this.data.description,
            createdAt: this.data.created_at,
        };
    }
}
//# sourceMappingURL=categoryModel.js.map