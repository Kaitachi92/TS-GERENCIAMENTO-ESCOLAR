// Centraliza a configuração do pool do PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'admin',
  database: process.env.DB_NAME || 'escola',
  port: 5432
});

module.exports = pool;
