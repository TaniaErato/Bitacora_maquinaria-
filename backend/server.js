require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // Tu archivo db.js que ya corregimos
const firestore = require('./config/firebase');

const errorHandler = require('./middlewares/errorHandler');
const serviciosRoutes = require('./routes/serviciosRoutes');

const app = express();

// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = [
  'http://localhost:4200', 
  'https://bitacora-frontend-theta.vercel.app',
  'https://bitacora-frontend-dw5qrv3n5-taniaeratos-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o el propio servidor)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app'); // Acepta cualquier despliegue de Vercel

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS bloqueado para el origen: ${origin}`);
      callback(new Error('No permitido por la política de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// --- MIDDLEWARES ---
app.use(express.json());

// Logs de inicio para Railway
console.log("🚀 INICIANDO SERVIDOR...");
console.log("📂 Base de Datos configurada:", process.env.MYSQL_DATABASE || "No definida");
console.log("🔗 URL de Conexión presente:", process.env.MYSQL_URL ? "SÍ ✅" : "NO ❌ (Revisa Railway)");
console.log("🔥 Firebase cargado correctamente");

// --- RUTAS ---

// Ruta de prueba (Health Check)
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API Bitácora Maquinaria funcionando en Railway",
    timestamp: new Date()
  });
});

// Tus rutas de servicios
app.use("/api", serviciosRoutes);

// --- MANEJO DE ERRORES ---
app.use(errorHandler);

// --- PUERTO ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});