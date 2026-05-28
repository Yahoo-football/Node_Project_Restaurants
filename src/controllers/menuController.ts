import { type Request, type Response } from 'express';
import menuService from '../services/menuService.js';

class MenuController {
  public getMenuItems = async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await menuService.getMenuItems();
      res.status(200).json({ message: 'Menu fetched successfully', data: items });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public createMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await menuService.createMenuItem({
        categoryId: Number(req.body.categoryId),
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        isAvailable: req.body.isAvailable,
      });

      res.status(201).json({ message: 'Menu item created successfully', data: item });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await menuService.updateMenuItem(Number(req.params.id), {
        ...(req.body.categoryId !== undefined ? { categoryId: Number(req.body.categoryId) } : {}),
        ...(req.body.name !== undefined ? { name: req.body.name } : {}),
        ...(req.body.description !== undefined ? { description: req.body.description } : {}),
        ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
        ...(req.body.isAvailable !== undefined ? { isAvailable: req.body.isAvailable } : {}),
      });

      res.status(200).json({ message: 'Menu item updated successfully', data: item });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
      await menuService.deleteMenuItem(Number(req.params.id));
      res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found')
      ? 404
      : message.includes('required') || message.includes('Invalid') || message.includes('Price')
        ? 400
        : 500;

    res.status(statusCode).json({ message });
  }
}

export default new MenuController();
