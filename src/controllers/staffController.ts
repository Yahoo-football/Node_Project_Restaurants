import { type Request, type Response } from 'express';
import { type AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import orderService from '../services/orderService.js';

class StaffController {
    public getOrders = async (_req: Request, res: Response): Promise<void> => {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
        } catch (error) {
            this.handleError(error, _req, res);
        }
    };

    public getOrderById = async (req: Request, res: Response): Promise<void> => {
        try {
            const orderId = Number(req.params.id);
            if (!Number.isInteger(orderId) || orderId <= 0) {
                this.sendError(res, req, 400, 'Bad Request', 'Invalid order id');
                return;
            }

            const order = await orderService.getOrderById(orderId);
            res.status(200).json({ success: true, message: 'Order fetched successfully', data: order });
        } catch (error) {
            this.handleError(error, req, res);
        }
    };

    public acceptOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const orderId = Number(req.params.id);
            if (!Number.isInteger(orderId) || orderId <= 0) {
                this.sendError(res, req, 400, 'Bad Request', 'Invalid order id');
                return;
            }

            const staffId = req.authUser?.id;
            if (!staffId) {
                this.sendError(res, req, 401, 'Unauthorized', 'Unauthorized');
                return;
            }

            const order = await orderService.acceptOrder(orderId, staffId);
            res.status(200).json({ success: true, message: 'Order accepted successfully', data: order });
        } catch (error) {
            this.handleError(error, req, res);
        }
    };

    public cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const orderId = Number(req.params.id);
            if (!Number.isInteger(orderId) || orderId <= 0) {
                this.sendError(res, req, 400, 'Bad Request', 'Invalid order id');
                return;
            }

            const staffId = req.authUser?.id;
            if (!staffId) {
                this.sendError(res, req, 401, 'Unauthorized', 'Unauthorized');
                return;
            }

            const order = await orderService.cancelOrder(orderId, staffId);
            res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
        } catch (error) {
            this.handleError(error, req, res);
        }
    };

    private handleError(error: unknown, req: Request, res: Response): void {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const statusCode =
            message === 'Order not found'
                ? 404
                : message.includes('required') ||
                    message.includes('Invalid') ||
                    message.includes('Only pending') ||
                    message.includes('cannot be')
                    ? 400
                    : 500;

        this.sendError(res, req, statusCode, this.getErrorName(statusCode), message);
    }

    private sendError(res: Response, req: Request, statusCode: number, error: string, message: string): void {
        res.status(statusCode).json({
            success: false,
            statusCode,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        });
    }

    private getErrorName(statusCode: number): string {
        if (statusCode === 400) {
            return 'Bad Request';
        }

        if (statusCode === 404) {
            return 'Not Found';
        }

        return 'Internal Server Error';
    }
}

export default new StaffController();
