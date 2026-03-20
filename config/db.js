const mysql = require("mysql2");

// Debug opcional (déjalo mientras pruebas)
console.log("MYSQL_URL:", process.env.MYSQL_URL ? "OK" : "NO DEFINIDA");

// ✅ Crear pool usando la URL de Railway
const pool = mysql.createPool(process.env.MYSQL_URL);

// Exportar con promesas
module.exports = pool.promise();

