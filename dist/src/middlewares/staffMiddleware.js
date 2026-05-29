import {} from 'express';
import {} from './authMiddleware.js';
class StaffMiddleware {
    ensureStaff = (req, res, next) => {
        if (!req.authUser) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (req.authUser.role !== 'staff') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
}
export default new StaffMiddleware();
//# sourceMappingURL=staffMiddleware.js.map