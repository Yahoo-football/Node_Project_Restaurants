import menuRepository from '../repositories/menuRepositories.js';
import {} from '../models/categoryModel.js';
import {} from '../models/menuModel.js';
class MenuService {
    async getCategories() {
        const categories = await menuRepository.findAllCategories();
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            createdAt: category.created_at,
        }));
    }
    async getMenuItems(options) {
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
    async getMenuItemById(id) {
        const item = await menuRepository.findMenuItemById(id);
        if (!item) {
            throw new Error('Menu item not found');
        }
        return this.mapMenuItem(item);
    }
    mapMenuItem(item) {
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
//# sourceMappingURL=menuService.js.map