import { type Request, type Response } from 'express';
declare class AdminController {
    getUsers: (_req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<void>;
    createUser: (req: Request, res: Response) => Promise<void>;
    updateUser: (req: Request, res: Response) => Promise<void>;
    deleteUser: (req: Request, res: Response) => Promise<void>;
    getDashboard: (_req: Request, res: Response) => Promise<void>;
    getSales: (_req: Request, res: Response) => Promise<void>;
    getTopProducts: (_req: Request, res: Response) => Promise<void>;
    private handleError;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=adminController.d.ts.map