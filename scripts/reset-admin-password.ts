import 'dotenv/config';
import crypto from 'crypto';
import mysql from 'mysql2/promise';

const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
const adminPassword = process.env.ADMIN_PASSWORD || '1234567';

function scrypt(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey.toString('hex'));
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt);
  return `${salt}:${derivedKey}`;
}

async function resetAdminPassword(): Promise<void> {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant_order_system',
  });

  try {
    const connection = await pool.getConnection();

    // Check if admin user exists
    const [rows]: any = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail],
    );

    const hashedPassword = await hashPassword(adminPassword);

    if (rows.length > 0) {
      // Update existing user
      await connection.execute('UPDATE users SET password = ?, role = ? WHERE email = ?', [
        hashedPassword,
        'admin',
        adminEmail,
      ]);

      console.log(`✓ Admin user "${adminEmail}" updated successfully`);
      console.log(`  Password: ${adminPassword}`);
      console.log(`  Role: admin`);
    } else {
      // Create new admin user
      await connection.execute(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Administrator', adminEmail, hashedPassword, 'admin', null],
      );

      console.log(`✓ Admin user created successfully`);
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}`);
      console.log(`  Role: admin`);
    }

    connection.release();
  } catch (error) {
    console.error('✗ Error resetting admin password:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
