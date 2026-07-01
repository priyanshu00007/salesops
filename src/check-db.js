require('dotenv/config');
const { Pool } = require('pg');

const config = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'sales2',
};

console.log('Testing PostgreSQL connection...');
console.log(`Host: ${config.host}`);
console.log(`Port: ${config.port}`);
console.log(`User: ${config.user}`);
console.log(`Database: ${config.database || '(will connect without database)'}`);

const pool = new Pool(config);

pool.query('SELECT version()', (err, result) => {
  if (err) {
    console.error('\n✗ Connection failed!');
    console.error(`  Error: ${err.message}`);
    console.error(`  Code: ${err.code}`);
    console.error('\nTroubleshooting tips:');
    console.error('  1. Is PostgreSQL installed? Run: psql --version');
    console.error('  2. Is the PostgreSQL service running? Run: Get-Service postgres*');
    console.error('  3. Check if host/port/user/password in .env are correct');
    console.error('  4. Create the database: createdb -U postgres sales2');
    process.exit(1);
  } else {
    console.log('\n✓ Connection successful!');
    console.log(`  PostgreSQL version: ${result.rows[0].version}`);
    pool.end();
  }
});
