import {} from 'express';
import {} from './authMiddleware.js';
class AdminMiddleware {
    ensureAdmin = (req, res, next) => {
        if (!req.authUser) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (req.authUser.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
}
export default new AdminMiddleware();
//# sourceMappingURL=adminMiddleware.js.map