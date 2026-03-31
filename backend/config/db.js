const mysql = require('mysql2/promise');

console.log("🔍 Intentando leer variable...");

const connectionString = process.env.MYSQL_DATABASE;

console.log("📦 MYSQL_DATABASE:", connectionString);

if (!connectionString) {
  console.error("❌ DATABASE NO DEFINIDA");
  process.exit(1);
}

let pool;

try {
  pool = mysql.createPool(connectionString);
  console.log("✅ Pool creado");
} catch (error) {
  console.error("❌ Error creando pool:", error);
  process.exit(1);
}

module.exports = pool;