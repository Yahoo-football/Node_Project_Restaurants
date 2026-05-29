import { type Response } from 'express';
import customerService from '../services/customerService.js';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';

class CustomerController {
  public getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const cart = await customerService.getCart(customerId);
      res.status(200).json({ message: 'Cart fetched successfully', data: cart });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const rawBody = req.body ?? {};
      const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : rawBody;
      const query = req.query ?? {};
      const menuItemId = Number(
        body.menuItemId ?? body.productID ?? body.productId ?? body.id ?? query.menuItemId ?? query.productID ?? query.productId ?? query.id,
      );
      const quantity = Number(body.quantity ?? query.quantity ?? 1);

      if (!menuItemId) {
        throw new Error('menuItemId is required');
      }
      if (quantity <= 0) {
        throw new Error('quantity must be greater than zero');
      }

      const cart = await customerService.addToCart(customerId, {
        menuItemId,
        quantity,
      });

      res.status(200).json({ message: 'Item added to cart', data: cart });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const cart = await customerService.updateCartItem(customerId, {
        itemId: Number(req.params.itemId),
        quantity: Number(req.body.quantity),
      });

      res.status(200).json({ message: 'Cart updated successfully', data: cart });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public removeCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const cart = await customerService.removeCartItem(customerId, Number(req.params.itemId));
      res.status(200).json({ message: 'Cart item removed successfully', data: cart });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.authUser?.id;
      if (!customerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await customerService.clearCart(customerId);
      res.status(200).json({ message: 'Cart cleared successfully', data: { items: [], total: 0, itemCount: 0 } });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode =
      message === 'Cart not found' || message === 'Cart item not found'
        ? 404
        : message.includes('required') || message.includes('Invalid')
        ? 400
        : 500;

    res.status(statusCode).json({ message });
  }
}

export default new CustomerController();
