export interface CategoryRecord {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface PublicCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string | null;
}

export class Category {
  constructor(private readonly data: CategoryRecord) {}

  public toPublicObject(): PublicCategory {
    return {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      createdAt: this.data.created_at,
    };
  }
}
