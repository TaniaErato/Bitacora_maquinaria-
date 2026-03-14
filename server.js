const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

connection.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("Conectado a MySQL Railway");
  }
});

const serviciosRoutes = require("./routes/serviciosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", serviciosRoutes);

app.get("/", (req,res)=>{
    res.send("API Bitácora Maquinaria funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
