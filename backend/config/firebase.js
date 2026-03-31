const admin = require('firebase-admin');

let serviceAccount;

// Si existe la variable en Railway, la usamos
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log("✅ Usando Firebase desde Variables de Entorno");
    } catch (e) {
        console.error("❌ Error al parsear FIREBASE_SERVICE_ACCOUNT:", e);
    }
} else {
    // Si no hay variable (estás en tu PC local), busca el archivo
    console.log("🔍 Intentando leer archivo local para Firebase...");
    serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;