import 'dotenv/config';
import mysql, {} from 'mysql2/promise';
class Database {
    pool = null;
    createConfig() {
        return {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'restaurant_order_system',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        };
    }
    getOrCreatePool() {
        if (!this.pool) {
            this.pool = mysql.createPool(this.createConfig());
        }
        return this.pool;
    }
    async connect() {
        const connection = await this.getOrCreatePool().getConnection();
        try {
            await connection.ping();
            console.log('Database connected successfully');
        }
        finally {
            connection.release();
        }
    }
    async getConnection() {
        return this.getOrCreatePool().getConnection();
    }
    getPool() {
        return this.getOrCreatePool();
    }
}
const database = new Database();
export const connectDB = async () => {
    await database.connect();
};
export default database;
//# sourceMappingURL=db.js.map