/**
 * Script to create admin and staff users with proper bcrypt hashed passwords
 * Run: node scripts/createAdmin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'warehouse_db'
  });

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);

    console.log('Generated hashes:');
    console.log('admin123:', adminPassword);
    console.log('staff123:', staffPassword);

    // Check if users exist
    const [existingUsers] = await connection.query('SELECT username FROM users WHERE username IN (?, ?)', ['admin', 'staff']);

    if (existingUsers.length > 0) {
      console.log('\nUsers already exist. Updating passwords...');

      await connection.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [adminPassword, 'admin']
      );

      await connection.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [staffPassword, 'staff']
      );

      console.log('Passwords updated successfully!');
    } else {
      console.log('\nCreating new users...');

      await connection.query(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@example.com', adminPassword, 'Administrator', 'ADMIN', true]
      );

      await connection.query(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['staff', 'staff@example.com', staffPassword, 'Staff User', 'STAFF', true]
      );

      console.log('Users created successfully!');
    }

    // Verify
    const [users] = await connection.query('SELECT id, username, email, full_name, role, is_active FROM users');
    console.log('\nCurrent users in database:');
    console.table(users);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

createUsers();
