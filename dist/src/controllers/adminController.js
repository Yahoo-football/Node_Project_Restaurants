import {} from 'express';
import adminService from '../services/adminService.js';
class AdminController {
    getUsers = async (_req, res) => {
        try {
            const users = await adminService.getUsers();
            res.status(200).json({ message: 'Users fetched successfully', data: users });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getUserById = async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await adminService.getUserById(userId);
            res.status(200).json({ message: 'User fetched successfully', data: user });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    createUser = async (req, res) => {
        try {
            const user = await adminService.createUser({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                phone: req.body.phone,
            });
            res.status(201).json({ message: 'User created successfully', data: user });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    updateUser = async (req, res) => {
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
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    deleteUser = async (req, res) => {
        try {
            const userId = Number(req.params.id);
            await adminService.deleteUser(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    handleError(error, res) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = message === 'User not found'
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
//# sourceMappingURL=adminController.js.map