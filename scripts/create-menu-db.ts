import 'dotenv/config';
import mysql from 'mysql2/promise';

async function setupMenuDatabase(): Promise<void> {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant_order_system',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `
        CREATE TABLE IF NOT EXISTS menu_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NULL,
          price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          image VARCHAR(255) NULL,
          category_id INT NULL,
          status VARCHAR(50) NULL DEFAULT 'active',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `,
    );

    console.log('✓ Menu database schema created or already exists.');
  } catch (error) {
    console.error('✗ Failed to create menu database schema:', error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

setupMenuDatabase();
