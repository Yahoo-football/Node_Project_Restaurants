import { type CreateOrderItemInput, Order, type OrderItemRecord, type PublicOrder } from '../models/orderModel.js';
import orderRepository from '../repositories/orderRepositories.js';
import menuRepository from '../repositories/menuRepositories.js';

class OrderService {
  public async getAllOrders(): Promise<PublicOrder[]> {
    const orders = await orderRepository.findAllOrders();
    const items = await orderRepository.findItemsByOrderIds(orders.map((order) => order.id));

    return orders.map((order) => new Order(order, this.itemsForOrder(items, order.id)).toPublicObject());
  }

  public async getOrdersByCustomerId(customerId: number): Promise<PublicOrder[]> {
    const orders = await orderRepository.findOrdersByCustomerId(customerId);
    const items = await orderRepository.findItemsByOrderIds(orders.map((order) => order.id));

    return orders.map((order) => new Order(order, this.itemsForOrder(items, order.id)).toPublicObject());
  }

  public async getOrderById(id: number): Promise<PublicOrder> {
    this.validateId(id);

    const order = await orderRepository.findOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    const items = await orderRepository.findItemsByOrderIds([id]);
    return new Order(order, items).toPublicObject();
  }

  public async getOrderByIdForCustomer(orderId: number, customerId: number): Promise<PublicOrder> {
    this.validateId(orderId);

    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.customer_id !== customerId) {
      throw new Error('Forbidden');
    }

    const items = await orderRepository.findItemsByOrderIds([orderId]);
    return new Order(order, items).toPublicObject();
  }

  public async createOrder(customerId: number, items: CreateOrderItemInput[]): Promise<PublicOrder> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Order items are required');
    }

    const normalizedItems = items.map((item, index) => {
      const menuItemId = Number(item.menuItemId);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
        throw new Error(`Invalid menu item id at index ${index}`);
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity at index ${index}`);
      }

      return { menuItemId, quantity };
    });

    const menuItems = await Promise.all(
      normalizedItems.map((item) => menuRepository.findById(item.menuItemId)),
    );

    const orderItems = normalizedItems.map((item, index) => {
      const menuItem = menuItems[index];
      if (!menuItem) {
        throw new Error(`Menu item not found for id ${item.menuItemId}`);
      }

      return {
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        price: Number(menuItem.price),
      };
    });

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await orderRepository.createOrder(customerId, totalPrice);
    await orderRepository.createOrderItems(order.id, orderItems);

    return this.getOrderById(order.id);
  }

  public async acceptOrder(orderId: number, staffId: number): Promise<PublicOrder> {
    this.validateId(orderId);
    this.validateStaffId(staffId);

    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be accepted');
    }

    await orderRepository.updateOrderStatus(orderId, 'completed', staffId);
    return this.getOrderById(orderId);
  }

  public async cancelOrder(orderId: number, staffId: number): Promise<PublicOrder> {
    this.validateId(orderId);
    this.validateStaffId(staffId);

    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new Error('Completed or cancelled orders cannot be cancelled');
    }

    await orderRepository.updateOrderStatus(orderId, 'cancelled', order.staff_id ?? staffId);
    return this.getOrderById(orderId);
  }

  private itemsForOrder(items: OrderItemRecord[], orderId: number): OrderItemRecord[] {
    return items.filter((item) => item.order_id === orderId);
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid order id');
    }
  }

  private validateStaffId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid staff id');
    }
  }
}

export default new OrderService();
