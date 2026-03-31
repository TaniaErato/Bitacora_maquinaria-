require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const firestore = require('./config/firebase');

const errorHandler = require('./middlewares/errorHandler');
const serviciosRoutes = require('./routes/serviciosRoutes');

const app = express();

// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = [
  'http://localhost:4200', 
  'https://bitacora-frontend-theta.vercel.app' // URL corregida (sin el / al final)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log en consola del servidor para identificar el origen bloqueado si falla
      console.error(`CORS bloqueado para el origen: ${origin}`);
      callback(new Error('El permiso CORS para este origen no está permitido'));
    }
  },
  credentials: true
}));

// --- MIDDLEWARES ---
app.use(express.json());

// Logs de inicio
console.log("🚀 INICIANDO SERVIDOR...");
console.log("DB NAME:", process.env.MYSQL_DATABASE);
console.log("🔥 Firebase cargado correctamente");

// --- RUTAS ---

// Ruta de prueba para saber si el back vive
app.get("/", (req, res) => {
  res.send("API Bitácora Maquinaria funcionando correctamente en Railway");
});

// Tus rutas de servicios
app.use("/api", serviciosRoutes);

// --- MANEJO DE ERRORES ---
app.use(errorHandler);

// --- PUERTO ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});