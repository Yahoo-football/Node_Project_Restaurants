export class Payment {
    data;
    constructor(data) {
        this.data = data;
    }
    toPublicObject() {
        return {
            id: this.data.id,
            orderId: this.data.order_id,
            amount: Number(this.data.amount),
            status: this.data.status,
            paymentMethod: this.data.payment_method,
            transactionReference: this.data.transaction_reference,
            createdAt: this.data.created_at,
        };
    }
}
//# sourceMappingURL=paymentModel.js.map