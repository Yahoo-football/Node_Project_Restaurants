import { type CartItemAddInput, type CartItemUpdateInput, type CartResponse } from '../models/customerModel.js';
declare class CustomerService {
    getCart(customerId: number): Promise<CartResponse>;
    addToCart(customerId: number, data: CartItemAddInput): Promise<CartResponse>;
    updateCartItem(customerId: number, data: CartItemUpdateInput): Promise<CartResponse>;
    removeCartItem(customerId: number, itemId: number): Promise<CartResponse>;
    clearCart(customerId: number): Promise<void>;
    private ensureCart;
    private buildCartResponse;
}
declare const _default: CustomerService;
export default _default;
//# sourceMappingURL=customerService.d.ts.map