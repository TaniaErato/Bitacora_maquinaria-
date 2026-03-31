const mysql = require('mysql2/promise');

console.log("🔍 Intentando leer variable de conexión...");

// Cambiamos MYSQL_DATABASE por MYSQL_URL que tiene toda la info
const connectionString = process.env.MYSQL_URL;

console.log("📦 Usando Connection String:", connectionString ? "Cargada (Oculta por seguridad)" : "VACÍA ❌");

if (!connectionString) {
  console.error("❌ MYSQL_URL NO DEFINIDA en las variables de entorno");
  // No salgas del proceso aquí si quieres que el servidor al menos encienda, 
  // pero la base de datos fallará.
}

let pool;

try {
  // mysql2 acepta la URL completa directamente
  pool = mysql.createPool(connectionString);
  console.log("✅ Pool de conexiones configurado correctamente");
} catch (error) {
  console.error("❌ Error creando el pool de MySQL:", error);
}

module.exports = pool;