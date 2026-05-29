import menuRepository from '../repositories/menuRepositories.js';
import { MenuItem } from '../models/menuModel.js';
class MenuService {
    async getMenuItems() {
        const items = await menuRepository.findAll();
        return items.map((item) => new MenuItem(item).toPublicObject());
    }
    async createMenuItem(data) {
        await this.validateCreateInput(data);
        const created = await menuRepository.create({
            name: data.name.trim(),
            price: data.price,
            ...(data.description?.trim() ? { description: data.description.trim() } : {}),
            ...(data.image !== undefined ? { image: data.image } : {}),
            ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
        });
        return new MenuItem(created).toPublicObject();
    }
    async updateMenuItem(id, data) {
        this.validateId(id);
        const existing = await menuRepository.findById(id);
        if (!existing) {
            throw new Error('Menu item not found');
        }
        if (data.price !== undefined && data.price < 0) {
            throw new Error('Price must be a positive number');
        }
        const updated = await menuRepository.update(id, {
            ...(data.name !== undefined ? { name: data.name.trim() } : {}),
            ...(data.description !== undefined
                ? { description: data.description === null ? null : data.description.trim() }
                : {}),
            ...(data.price !== undefined ? { price: data.price } : {}),
            ...(data.image !== undefined ? { image: data.image } : {}),
            ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
        });
        return new MenuItem(updated).toPublicObject();
    }
    async deleteMenuItem(id) {
        this.validateId(id);
        const existing = await menuRepository.findById(id);
        if (!existing) {
            throw new Error('Menu item not found');
        }
        await menuRepository.delete(id);
    }
    async validateCreateInput(data) {
        if (!data.name?.trim()) {
            throw new Error('Menu item name is required');
        }
        if (data.price < 0) {
            throw new Error('Price must be a positive number');
        }
    }
    validateId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid id');
        }
    }
}
export default new MenuService();
//# sourceMappingURL=menuService.js.map