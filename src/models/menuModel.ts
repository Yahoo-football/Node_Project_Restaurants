export interface MenuItemRecord {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category_id: number | null;
  status: string | null;
  created_at: Date;
}

export interface PublicMenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: number | null;
  status: string | null;
  createdAt: Date;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId?: number;
  status?: string;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string | null;
  price?: number;
  image?: string | null;
  categoryId?: number | null;
  status?: string | null;
}

export class MenuItem {
  constructor(private readonly data: MenuItemRecord) {}

  public toPublicObject(): PublicMenuItem {
    return {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      price: Number(this.data.price),
      image: this.data.image ?? null,
      categoryId: this.data.category_id ?? null,
      status: this.data.status ?? null,
      createdAt: this.data.created_at,
    };
  }
}
