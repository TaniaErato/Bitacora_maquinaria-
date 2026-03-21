const mysql = require("mysql2");

console.log("MYSQL_URL:", process.env.MYSQL_URL2 ? "OK" : "NO DEFINIDA");

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL2,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool.promise();
