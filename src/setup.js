require('dotenv/config');

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function setup() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf-8');

  const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'sales2',
  });

  try {
    await pool.query(sql);
    console.log('Database tables created successfully.');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database already set up.');
    } else {
      console.error('Setup error:', err);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

setup();
