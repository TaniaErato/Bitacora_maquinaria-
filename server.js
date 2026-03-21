console.log("ENV TEST:", process.env);

const express = require("express");
const cors = require("cors");

const serviciosRoutes = require("./routes/serviciosRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Bitácora Maquinaria funcionando");
});

// Rutas
app.use("/api", serviciosRoutes);

// Puerto dinámico (IMPORTANTE para Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});