export class Order {
    data;
    constructor(data) {
        this.data = data;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            customerId: this.data.customer_id,
            customerName: this.data.customer_name ?? null,
            staffId: this.data.staff_id,
            staffName: this.data.staff_name ?? null,
            totalAmount: Number(this.data.total_amount),
            status: this.data.status,
            createdAt: this.data.created_at,
        };
    }
}
//# sourceMappingURL=orderModel.js.map