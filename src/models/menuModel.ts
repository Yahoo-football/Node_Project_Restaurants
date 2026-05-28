export interface MenuItemRecord {
  id: number;
  category_id: number;
  category_name?: string | null;
  name: string;
  description: string | null;
  price: number;
  is_available: number | boolean;
  created_at: Date;
}

export interface PublicMenuItem {
  id: number;
  categoryId: number;
  categoryName: string | null;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
}

export interface CreateMenuItemInput {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
}

export interface UpdateMenuItemInput {
  categoryId?: number;
  name?: string;
  description?: string | null;
  price?: number;
  isAvailable?: boolean;
}

export class MenuItem {
  constructor(private readonly data: MenuItemRecord) {}

  public toPublicObject(): PublicMenuItem {
    return {
      id: this.data.id,
      categoryId: this.data.category_id,
      categoryName: this.data.category_name ?? null,
      name: this.data.name,
      description: this.data.description,
      price: Number(this.data.price),
      isAvailable: Boolean(this.data.is_available),
      createdAt: this.data.created_at,
    };
  }
}
