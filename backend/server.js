require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const firestore = require('./config/firebase');

const errorHandler = require('./middlewares/errorHandler');
const serviciosRoutes = require('./routes/serviciosRoutes');

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Aquí agregamos tu URL de Vercel para que el celular pueda conectar
const allowedOrigins = [
  'http://localhost:4200', 
  'https://bitacora-frontend-theta.vercel.app/' // 👈 REEMPLAZA ESTO CON TU URL REAL DE VERCEL
];

app.use(cors({
  origin: function (origin, callback) {
    // permitir peticiones sin origen (como Postman o apps móviles nativas)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('El permiso CORS para este origen no está permitido'), false);
    }
    return callback(null, true);
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
// Activarlo ayuda a que si algo falla, el servidor no se detenga por completo
app.use(errorHandler);

// --- PUERTO ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});