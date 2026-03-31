const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        
        // ESTA LÍNEA ES LA MAGIA:
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        
        console.log("✅ Credenciales de Firebase parseadas correctamente");
    } catch (e) {
        console.error("❌ Error en el formato de FIREBASE_SERVICE_ACCOUNT:", e.message);
    }
} else {
    serviceAccount = require('./serviceAccountKey.json');
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const firestore = admin.firestore(); // Asegúrate de exportar la instancia de la DB
module.exports = firestore;