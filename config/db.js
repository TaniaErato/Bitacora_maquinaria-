const mysql = require('mysql2');

const connectionString = process.env.MYSQL_DATABASE;

if (!connectionString) {
  console.error("❌ DATABASE NO DEFINIDA");
  process.exit(1);
}

const pool = mysql.createPool(connectionString);

module.exports = pool;