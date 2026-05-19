import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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