import { Order, type OrderItemRecord, type PublicOrder } from '../models/orderModel.js';
import orderRepository from '../repositories/orderRepositories.js';

class OrderService {
  public async getAllOrders(): Promise<PublicOrder[]> {
    const orders = await orderRepository.findAllOrders();
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
