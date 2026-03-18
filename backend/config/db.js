const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('Base de données connectée'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

module.exports = pool;