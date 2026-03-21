const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const crearTablas = require("./crearTablas");

const serviciosRoutes = require("./routes/serviciosRoutes");

const app = express();

// Logs
console.log("🚀 INICIANDO SERVIDOR...");
console.log("ENV MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

// Middlewares
app.use(cors());
app.use(express.json());

// Crear tablas automáticamente
crearTablas();

// Ruta base
app.get("/", (req, res) => {
  res.send("API Bitácora Maquinaria funcionando");
});

// Rutas
app.use("/api", serviciosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});