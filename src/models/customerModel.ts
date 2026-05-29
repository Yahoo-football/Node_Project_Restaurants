export interface CartRecord {
  id: number;
  customer_id: number;
  created_at: Date;
}

export interface CartItemDetail {
  id: number;
  cartId: number;
  menuItemId: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  quantity: number;
  subtotal: number;
  categoryName: string | null;
}

export interface CartResponse {
  id: number;
  customerId: number;
  items: CartItemDetail[];
  total: number;
  itemCount: number;
}

export interface CartItemAddInput {
  menuItemId: number;
  quantity: number;
}

export interface CartItemUpdateInput {
  itemId: number;
  quantity: number;
}
