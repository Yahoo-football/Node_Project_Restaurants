import 'dotenv/config';
import mysql, { type Pool, type PoolConnection, type PoolOptions } from 'mysql2/promise';

class Database {
  private pool: Pool | null = null;

  private createConfig(database?: string): PoolOptions {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: database ?? (process.env.DB_NAME || 'restaurant_order_system'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  private getOrCreatePool(): Pool {
    if (!this.pool) {
      this.pool = mysql.createPool(this.createConfig());
    }

    return this.pool;
  }

  public async ensureDatabaseExists(): Promise<void> {
    const databaseName = process.env.DB_NAME || 'restaurant_order_system';
    const tempPool = mysql.createPool(this.createConfig(undefined));

    try {
      await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
      console.log(`Ensured database exists: ${databaseName}`);
    } finally {
      await tempPool.end();
    }
  }

  public async connect(): Promise<void> {
    const databaseName = process.env.DB_NAME || 'restaurant_order_system';

    await this.ensureDatabaseExists();
    this.pool = mysql.createPool(this.createConfig(databaseName));

    const connection = await this.getOrCreatePool().getConnection();

    try {
      await connection.ping();
      console.log('Database connected successfully');
    } finally {
      connection.release();
    }
  }

  public async getConnection(): Promise<PoolConnection> {
    return this.getOrCreatePool().getConnection();
  }

  public getPool(): Pool {
    return this.getOrCreatePool();
  }
}

const database = new Database();

export const connectDB = async (): Promise<void> => {
  await database.connect();
};

export default database;
