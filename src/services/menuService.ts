import categoryRepository from '../repositories/categoryRepositories.js';
import menuRepository from '../repositories/menuRepositories.js';
import { MenuItem, type CreateMenuItemInput, type PublicMenuItem, type UpdateMenuItemInput } from '../models/menuModel.js';

class MenuService {
  public async getMenuItems(): Promise<PublicMenuItem[]> {
    const items = await menuRepository.findAll();
    return items.map((item) => new MenuItem(item).toPublicObject());
  }

  public async createMenuItem(data: CreateMenuItemInput): Promise<PublicMenuItem> {
    await this.validateCreateInput(data);

    const created = await menuRepository.create({
      categoryId: data.categoryId,
      name: data.name.trim(),
      price: data.price,
      ...(data.description?.trim() ? { description: data.description.trim() } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
    });

    return new MenuItem(created).toPublicObject();
  }

  public async updateMenuItem(id: number, data: UpdateMenuItemInput): Promise<PublicMenuItem> {
    this.validateId(id);

    const existing = await menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu item not found');
    }

    if (data.categoryId !== undefined) {
      await this.ensureCategoryExists(data.categoryId);
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price must be a positive number');
    }

    const updated = await menuRepository.update(id, {
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description === null ? null : data.description.trim() }
        : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
    });

    return new MenuItem(updated).toPublicObject();
  }

  public async deleteMenuItem(id: number): Promise<void> {
    this.validateId(id);

    const existing = await menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu item not found');
    }

    await menuRepository.delete(id);
  }

  private async validateCreateInput(data: CreateMenuItemInput): Promise<void> {
    this.validateId(data.categoryId);

    if (!data.name?.trim()) {
      throw new Error('Menu item name is required');
    }

    if (data.price < 0) {
      throw new Error('Price must be a positive number');
    }

    await this.ensureCategoryExists(data.categoryId);
  }

  private async ensureCategoryExists(categoryId: number): Promise<void> {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid id');
    }
  }
}

export default new MenuService();
