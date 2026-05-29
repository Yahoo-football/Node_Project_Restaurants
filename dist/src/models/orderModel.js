export class Order {
    data;
    items;
    constructor(data, items = []) {
        this.data = data;
        this.items = items;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            customerId: this.data.customer_id,
            customerName: this.data.customer_name,
            staffId: this.data.staff_id,
            staffName: this.data.staff_name,
            status: this.data.status,
            totalPrice: Number(this.data.total_price ?? 0),
            createdAt: this.data.created_at,
            items: this.items.map((item) => ({
                id: item.id,
                menuItemId: item.menu_item_id,
                menuItemName: item.menu_item_name,
                quantity: item.quantity,
                price: Number(item.price),
            })),
        };
    }
}
//# sourceMappingURL=orderModel.js.map