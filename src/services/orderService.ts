import orderRepository from '../repositories/orderRepositories.js';
import authRepository from '../repositories/authRepositories.js';
import { Order, type OrderStatus, type PublicOrder } from '../models/orderModel.js';

class OrderService {
  private readonly allowedStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

  public async getOrders(): Promise<PublicOrder[]> {
    const orders = await orderRepository.findAll();
    return orders.map((order) => new Order(order).toPublicObject());
  }

  public async updateOrderStatus(id: number, status: OrderStatus, staffId?: number | null): Promise<PublicOrder> {
    this.validateId(id);

    if (!this.allowedStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error('Order not found');
    }

    if (staffId !== undefined && staffId !== null) {
      const staff = await authRepository.findUserById(staffId);
      if (!staff || staff.role !== 'staff') {
        throw new Error('Assigned staff user not found');
      }
    }

    const updated = await orderRepository.updateStatus(id, { status, ...(staffId !== undefined ? { staffId } : {}) });
    return new Order(updated).toPublicObject();
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid order id');
    }
  }
}

export default new OrderService();
