import 'dotenv/config';
import mysql from 'mysql2/promise';

async function ensureMenuColumns(): Promise<void> {
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
    // Check if table exists
    const [tables]: any = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'menu_items'`,
      [process.env.DB_NAME || 'restaurant_order_system'],
    );

    if (!tables || tables.length === 0) {
      console.error('✗ Table `menu_items` does not exist. Run scripts/create-menu-db.ts first to create it.');
      process.exit(1);
    }

    const [cols]: any = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'menu_items'`,
      [process.env.DB_NAME || 'restaurant_order_system'],
    );

    const existingColumns = new Set(cols.map((c: any) => c.COLUMN_NAME));

    if (!existingColumns.has('image')) {
      console.log('Adding missing column `image` to `menu_items`...');
      await connection.execute(`ALTER TABLE menu_items ADD COLUMN image VARCHAR(255) NULL`);
      console.log('✓ `image` column added.');
    } else {
      console.log('`image` column already present.');
    }

    if (!existingColumns.has('category_id')) {
      console.log('Adding missing column `category_id` to `menu_items`...');
      await connection.execute(`ALTER TABLE menu_items ADD COLUMN category_id INT NULL`);
      console.log('✓ `category_id` column added.');
    } else {
      console.log('`category_id` column already present.');
    }

    // Drop any legacy foreign key on category_id so categories are optional
    const [foreignKeys]: any = await connection.query(
      `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'menu_items'
         AND COLUMN_NAME = 'category_id'
         AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [process.env.DB_NAME || 'restaurant_order_system'],
    );

    if (foreignKeys && foreignKeys.length > 0) {
      for (const fk of foreignKeys) {
        const constraintName = fk.CONSTRAINT_NAME as string;
        console.log('Dropping legacy foreign key constraint ' + constraintName + ' from menu_items.');
        await connection.execute(`ALTER TABLE menu_items DROP FOREIGN KEY \`${constraintName}\``);
      }
    }

    if (!existingColumns.has('status')) {
      console.log('Adding missing column `status` to `menu_items`...');
      await connection.execute(`ALTER TABLE menu_items ADD COLUMN status VARCHAR(50) NULL DEFAULT 'active'`);
      console.log('✓ `status` column added.');
    } else {
      // If status exists, ensure it's large enough to hold expected values
      console.log('`status` column already present. Verifying size...');
      const [statusCols]: any = await connection.query(
        `SELECT CHARACTER_MAXIMUM_LENGTH, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'status'`,
        [process.env.DB_NAME || 'restaurant_order_system'],
      );

      if (statusCols && statusCols.length > 0) {
        const len = statusCols[0].CHARACTER_MAXIMUM_LENGTH;
        const colType = statusCols[0].COLUMN_TYPE as string;
        if (!len || (typeof len === 'number' && len < 50) || colType.startsWith('enum(')) {
          console.log('Altering `status` column to VARCHAR(50) to avoid truncation...');
          await connection.execute(`ALTER TABLE menu_items MODIFY COLUMN status VARCHAR(50) NULL DEFAULT 'active'`);
          console.log('✓ `status` column modified to VARCHAR(50).');
        } else {
          console.log('`status` column size is sufficient.');
        }
      }
    }

    if (!existingColumns.has('price')) {
      console.log('Adding missing column `price` to `menu_items`...');
      await connection.execute(`ALTER TABLE menu_items ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00`);
      console.log('✓ `price` column added.');
    } else {
      console.log('`price` column already present.');
    }

    if (!existingColumns.has('created_at')) {
      console.log('Adding missing column `created_at` to `menu_items`...');
      await connection.execute(`ALTER TABLE menu_items ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      console.log('✓ `created_at` column added.');
    } else {
      console.log('`created_at` column already present.');
    }

    console.log('Schema check complete.');
  } catch (error) {
    console.error('✗ Error ensuring menu columns:', error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

ensureMenuColumns();
