import customerRepository from '../repositories/customerRepositories.js';
import menuRepository from '../repositories/menuRepositories.js';
import {} from '../models/customerModel.js';
class CustomerService {
    async getCart(customerId) {
        const cart = await this.ensureCart(customerId);
        const items = await customerRepository.findCartItemsByCartId(cart.id);
        return this.buildCartResponse(cart, items);
    }
    async addToCart(customerId, data) {
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
        }
        else {
            await customerRepository.insertCartItem(cart.id, data.menuItemId, data.quantity);
        }
        return this.getCart(customerId);
    }
    async updateCartItem(customerId, data) {
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
    async removeCartItem(customerId, itemId) {
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
    async clearCart(customerId) {
        const cart = await this.ensureCart(customerId);
        await customerRepository.clearCartItems(cart.id);
    }
    async ensureCart(customerId) {
        const existingCart = await customerRepository.findCartByCustomerId(customerId);
        if (existingCart) {
            return existingCart;
        }
        return customerRepository.createCart(customerId);
    }
    buildCartResponse(cart, items) {
        const formattedItems = items.map((item) => ({
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
//# sourceMappingURL=customerService.js.map