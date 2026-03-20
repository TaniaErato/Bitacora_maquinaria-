const mysql = require("mysql2");

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportamos con promesas (async/await)
module.exports = pool.promise();