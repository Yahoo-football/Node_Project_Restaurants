import { type Request, type Response } from 'express';
import adminService from '../services/adminService.js';

class AdminController {
  public getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await adminService.getUsers();
      res.status(200).json({ message: 'Users fetched successfully', data: users });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user = await adminService.getUserById(userId);
      res.status(200).json({ message: 'User fetched successfully', data: user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await adminService.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone: req.body.phone,
      });

      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user = await adminService.updateUser(userId, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone: req.body.phone,
      });

      res.status(200).json({ message: 'User updated successfully', data: user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      await adminService.deleteUser(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const summary = await adminService.getDashboardSummary();
      res.status(200).json({ message: 'Dashboard fetched successfully', data: summary });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getSales = async (_req: Request, res: Response): Promise<void> => {
    try {
      const sales = await adminService.getSalesSummary();
      res.status(200).json({ message: 'Sales report fetched successfully', data: sales });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getTopProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await adminService.getTopProducts();
      res.status(200).json({ message: 'Top products fetched successfully', data: products });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode =
      message === 'User not found'
        ? 404
        : message.includes('required') ||
            message.includes('Invalid') ||
            message.includes('registered') ||
            message.includes('only create')
          ? 400
          : 500;

    res.status(statusCode).json({ message });
  }
}

export default new AdminController();
