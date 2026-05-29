export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: number;
  customer_id: number;
  staff_id: number | null;
  status: OrderStatus;
  total_price: number | string | null;
  created_at: Date;
  customer_name: string;
  staff_name: string | null;
}

export interface OrderItemRecord {
  id: number;
  order_id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity: number;
  price: number | string;
}

export interface PublicOrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
}

export interface PublicOrder {
  id: number;
  customerId: number;
  customerName: string;
  staffId: number | null;
  staffName: string | null;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  items: PublicOrderItem[];
}

export class Order {
  public constructor(
    private readonly data: OrderRecord,
    private readonly items: OrderItemRecord[] = [],
  ) {}

  public toPublicObject(): PublicOrder {
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
