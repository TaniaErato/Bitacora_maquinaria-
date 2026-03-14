const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "apiuser",
  password: "123456",
  database: "bitacora_maquinaria"
});

connection.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

module.exports = connection;