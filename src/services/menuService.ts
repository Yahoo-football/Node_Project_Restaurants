import menuRepository from '../repositories/menuRepositories.js';
import {
  type CategoryResponse,
  type CategoryRecord,
} from '../models/categoryModel.js';
import {
  type MenuItemQueryOptions,
  type MenuItemRecord,
  type MenuItemResponse,
  type PaginatedResult,
} from '../models/menuModel.js';

class MenuService {
  public async getCategories(): Promise<CategoryResponse[]> {
    const categories = await menuRepository.findAllCategories();
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.created_at,
    }));
  }

  public async getMenuItems(options: MenuItemQueryOptions): Promise<PaginatedResult<MenuItemResponse>> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const offset = (page - 1) * limit;

    const { items, totalItems } = await menuRepository.findMenuItems({
      categoryId: options.categoryId,
      search: options.search,
      status: options.status,
      limit,
      offset,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });

    const formattedItems = items.map((item) => this.mapMenuItem(item));

    return {
      items: formattedItems,
      meta: {
        totalItems,
        itemCount: formattedItems.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  public async getMenuItemById(id: number): Promise<MenuItemResponse> {
    const item = await menuRepository.findMenuItemById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }

    return this.mapMenuItem(item);
  }

  private mapMenuItem(item: MenuItemRecord): MenuItemResponse {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      categoryId: item.category_id,
      categoryName: item.category_name ?? null,
      status: item.status,
      createdAt: item.created_at,
    };
  }
}

export default new MenuService();

