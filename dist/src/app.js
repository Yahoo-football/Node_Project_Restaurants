import express from 'express';
import adminRouter from './routes/adminRoute.js';
import authRouter from './routes/authRoute.js';
import customerRouter from './routes/customerRoute.js';
import menuRouter from './routes/menuRoute.js';
import staffRouter from './routes/staffRoute.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/customer', customerRouter);
app.use('/api/menu', menuRouter);
app.use('/api/staff', staffRouter);
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'API is running',
    });
});
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
    });
});
export default app;
//# sourceMappingURL=app.js.map