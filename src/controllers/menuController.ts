import { type Request, type Response } from 'express';
import menuService from '../services/menuService.js';
import { type MenuItemStatus } from '../models/menuModel.js';

class MenuController {
  public getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await menuService.getCategories();
      res.status(200).json({ message: 'Categories fetched successfully', data: categories });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMenuItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await menuService.getMenuItems({
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        search: req.query.search?.toString() as string | undefined,
        status: req.query.status ? (req.query.status.toString() as MenuItemStatus) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy?.toString(),
        sortOrder: req.query.sortOrder?.toString() as 'ASC' | 'DESC' | undefined,
      });

      res.status(200).json({ message: 'Menu items fetched successfully', data: result.items, meta: result.meta });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMenuItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const itemId = Number(req.params.id);
      const menuItem = await menuService.getMenuItemById(itemId);
      res.status(200).json({ message: 'Menu item fetched successfully', data: menuItem });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message === 'Menu item not found' ? 404 : 400;
    res.status(statusCode).json({ message });
  }
}

export default new MenuController();
