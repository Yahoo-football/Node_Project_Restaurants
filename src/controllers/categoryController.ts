import { type Request, type Response } from 'express';
import categoryService from '../services/categoryService.js';

class CategoryController {
  public getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await categoryService.getCategories();
      res.status(200).json({ message: 'Categories fetched successfully', data: categories });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({ message: 'Category created successfully', data: category });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.updateCategory(Number(req.params.id), req.body);
      res.status(200).json({ message: 'Category updated successfully', data: category });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      await categoryService.deleteCategory(Number(req.params.id));
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found')
      ? 404
      : message.includes('required') || message.includes('Invalid') || message.includes('exists')
        ? 400
        : 500;

    res.status(statusCode).json({ message });
  }
}

export default new CategoryController();
