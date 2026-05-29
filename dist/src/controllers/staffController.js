import {} from 'express';
import {} from '../middlewares/authMiddleware.js';
import orderService from '../services/orderService.js';
class StaffController {
    getOrders = async (_req, res) => {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
        }
        catch (error) {
            this.handleError(error, _req, res);
        }
    };
    getOrderById = async (req, res) => {
        try {
            const orderId = Number(req.params.id);
            if (!Number.isInteger(orderId) || orderId <= 0) {
                this.sendError(res, req, 400, 'Bad Request', 'Invalid order id');
                return;
            }
            const order = await orderService.getOrderById(orderId);
            res.status(200).json({ success: true, message: 'Order fetched successfully', data: order });
        }
        catch (error) {
            this.handleError(error, req, res);
        }
    };
    acceptOrder = async (req, res) => {
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
        }
        catch (error) {
            this.handleError(error, req, res);
        }
    };
    cancelOrder = async (req, res) => {
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
        }
        catch (error) {
            this.handleError(error, req, res);
        }
    };
    handleError(error, req, res) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = message === 'Order not found'
            ? 404
            : message.includes('required') ||
                message.includes('Invalid') ||
                message.includes('Only pending') ||
                message.includes('cannot be')
                ? 400
                : 500;
        this.sendError(res, req, statusCode, this.getErrorName(statusCode), message);
    }
    sendError(res, req, statusCode, error, message) {
        res.status(statusCode).json({
            success: false,
            statusCode,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        });
    }
    getErrorName(statusCode) {
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
//# sourceMappingURL=staffController.js.map