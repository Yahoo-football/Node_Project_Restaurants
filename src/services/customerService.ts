import customerRepository from '../repositories/customerRepositories.js';
import menuRepository from '../repositories/menuRepositories.js';
import {
  type CartItemAddInput,
  type CartItemDetail,
  type CartItemUpdateInput,
  type CartRecord,
  type CartResponse,
} from '../models/customerModel.js';

type CartItemDbRow = {
  id: number;
  cart_id: number;
  menu_item_id: number;
  quantity: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category_name: string | null;
};

class CustomerService {
  public async getCart(customerId: number): Promise<CartResponse> {
    const cart = await this.ensureCart(customerId);
    const items = await customerRepository.findCartItemsByCartId(cart.id);
    return this.buildCartResponse(cart, items);
  }

  public async addToCart(customerId: number, data: CartItemAddInput): Promise<CartResponse> {
    if (!data.menuItemId || data.quantity <= 0) {
      throw new Error('Menu item id and quantity are required');
    }

    const menuItem = await menuRepository.findMenuItemById(data.menuItemId);
    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    if (menuItem.status !== 'available') {
      throw new Error('Menu item is unavailable');
    }

    const cart = await this.ensureCart(customerId);
    const existingItem = await customerRepository.findCartItemByCartIdAndMenuItemId(cart.id, data.menuItemId);

    if (existingItem) {
      await customerRepository.updateCartItemQuantity(existingItem.id, existingItem.quantity + data.quantity);
    } else {
      await customerRepository.insertCartItem(cart.id, data.menuItemId, data.quantity);
    }

    return this.getCart(customerId);
  }

  public async updateCartItem(customerId: number, data: CartItemUpdateInput): Promise<CartResponse> {
    if (!data.itemId || data.quantity <= 0) {
      throw new Error('Cart item id and quantity are required');
    }

    const cart = await this.ensureCart(customerId);
    const existingItem = await customerRepository.findCartItemById(data.itemId);
    if (!existingItem || existingItem.cart_id !== cart.id) {
      throw new Error('Cart item not found');
    }

    await customerRepository.updateCartItemQuantity(data.itemId, data.quantity);
    return this.getCart(customerId);
  }

  public async removeCartItem(customerId: number, itemId: number): Promise<CartResponse> {
    if (!itemId) {
      throw new Error('Cart item id is required');
    }

    const cart = await this.ensureCart(customerId);
    const cartItem = await customerRepository.findCartItemById(itemId);
    if (!cartItem || cartItem.cart_id !== cart.id) {
      throw new Error('Cart item not found');
    }

    await customerRepository.deleteCartItem(itemId);
    return this.getCart(customerId);
  }

  public async clearCart(customerId: number): Promise<void> {
    const cart = await this.ensureCart(customerId);
    await customerRepository.clearCartItems(cart.id);
  }

  private async ensureCart(customerId: number): Promise<CartRecord> {
    const existingCart = await customerRepository.findCartByCustomerId(customerId);
    if (existingCart) {
      return existingCart;
    }

    return customerRepository.createCart(customerId);
  }

  private buildCartResponse(cart: CartRecord, items: CartItemDbRow[]): CartResponse {
    const formattedItems: CartItemDetail[] = items.map((item) => ({
      id: item.id,
      cartId: item.cart_id,
      menuItemId: item.menu_item_id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      quantity: item.quantity,
      subtotal: Number(item.price) * item.quantity,
      categoryName: item.category_name ?? null,
    }));

    const total = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      customerId: cart.customer_id,
      items: formattedItems,
      total,
      itemCount: formattedItems.length,
    };
  }
}

export default new CustomerService();
