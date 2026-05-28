import categoryRepository from '../repositories/categoryRepositories.js';
import { Category, type CreateCategoryInput, type PublicCategory, type UpdateCategoryInput } from '../models/categoryModel.js';

class CategoryService {
  public async getCategories(): Promise<PublicCategory[]> {
    const categories = await categoryRepository.findAll();
    return categories.map((category) => new Category(category).toPublicObject());
  }

  public async createCategory(data: CreateCategoryInput): Promise<PublicCategory> {
    this.validateName(data.name);

    const existing = await categoryRepository.findByName(data.name.trim());
    if (existing) {
      throw new Error('Category name already exists');
    }

    const created = await categoryRepository.create({
      name: data.name.trim(),
      ...(data.description?.trim() ? { description: data.description.trim() } : {}),
    });

    return new Category(created).toPublicObject();
  }

  public async updateCategory(id: number, data: UpdateCategoryInput): Promise<PublicCategory> {
    this.validateId(id);

    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    const nextName = data.name?.trim();
    if (nextName && nextName !== existing.name) {
      const categoryWithSameName = await categoryRepository.findByName(nextName);
      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new Error('Category name already exists');
      }
    }

    const updated = await categoryRepository.update(id, {
      ...(nextName !== undefined ? { name: nextName } : {}),
      ...(data.description !== undefined
        ? { description: data.description === null ? null : data.description.trim() }
        : {}),
    });

    return new Category(updated).toPublicObject();
  }

  public async deleteCategory(id: number): Promise<void> {
    this.validateId(id);

    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    await categoryRepository.delete(id);
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid category id');
    }
  }

  private validateName(name: string | undefined): void {
    if (!name?.trim()) {
      throw new Error('Category name is required');
    }
  }
}

export default new CategoryService();
