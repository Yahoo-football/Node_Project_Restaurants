import { type RowDataPacket } from 'mysql2/promise';
import { type CartRecord } from '../models/customerModel.js';
interface CartItemRow extends RowDataPacket {
    id: number;
    cart_id: number;
    menu_item_id: number;
    quantity: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category_name: string | null;
}
declare class CustomerRepository {
    findCartByCustomerId(customerId: number): Promise<CartRecord | null>;
    findCartById(id: number): Promise<CartRecord | null>;
    createCart(customerId: number): Promise<CartRecord>;
    findCartItemsByCartId(cartId: number): Promise<CartItemRow[]>;
    findCartItemByCartIdAndMenuItemId(cartId: number, menuItemId: number): Promise<CartItemRow | null>;
    findCartItemById(itemId: number): Promise<CartItemRow | null>;
    insertCartItem(cartId: number, menuItemId: number, quantity: number): Promise<void>;
    updateCartItemQuantity(itemId: number, quantity: number): Promise<void>;
    deleteCartItem(itemId: number): Promise<void>;
    clearCartItems(cartId: number): Promise<void>;
}
declare const _default: CustomerRepository;
export default _default;
//# sourceMappingURL=customerRepositories.d.ts.map