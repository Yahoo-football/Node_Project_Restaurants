import 'dotenv/config';
import { type Pool, type PoolConnection } from 'mysql2/promise';
declare class Database {
    private pool;
    private createConfig;
    private getOrCreatePool;
    connect(): Promise<void>;
    getConnection(): Promise<PoolConnection>;
    getPool(): Pool;
}
declare const database: Database;
export declare const connectDB: () => Promise<void>;
export default database;
//# sourceMappingURL=db.d.ts.map