// ─────────────────────────────────────────────────────────────
//  db.js  –  MySQL Connection Pool
//
//  WHY a pool instead of a single connection?
//  A pool keeps several connections open and reuses them.
//  This is faster than opening/closing a connection every time.
// ─────────────────────────────────────────────────────────────
require('dotenv').config();
const mysql = require('mysql2/promise');

// createPool → mysql2 will manage up to `connectionLimit`
// connections automatically.
const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              parseInt(process.env.DB_PORT) || 3306,
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASSWORD || '',
  database:          process.env.DB_NAME     || 'student_portal',
  waitForConnections: true,
  connectionLimit:   10,      // max 10 simultaneous connections
  queueLimit:        0,       // unlimited queue
  timezone:          '+00:00' // store dates as UTC
});

// Test the connection when the server starts
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL connected successfully to database:', process.env.DB_NAME);
    conn.release();           // always release the connection back to pool
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('    Check your .env file (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
    process.exit(1);          // stop the server if DB is unreachable
  }
}

testConnection();

module.exports = pool;
