const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // 👈 IMPORTANTE

const serviciosRoutes = require("./routes/serviciosRoutes");

const app = express();

// 🔍 Logs de entorno
console.log("🚀 INICIANDO SERVIDOR...");
console.log("ENV MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Bitácora Maquinaria funcionando");
});

// Endpoint directo (opcional)
app.get('/maquinaria', (req, res) => {
  pool.query('SELECT * FROM maquinaria', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }
    res.json(results);
  });
});

// Rutas organizadas
app.use("/api", serviciosRoutes);

// Puerto dinámico (Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});