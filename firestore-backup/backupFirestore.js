const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backupFirestore() {
  const collections = await db.listCollections();

  for (const collection of collections) {
    const snapshot = await collection.get();
    const data = {};

    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    fs.writeFileSync(`${collection.id}.json`, JSON.stringify(data, null, 2));
    console.log(`✅ Backup de la colección "${collection.id}" completado.`);
  }

  console.log('🎉 Respaldo completado.');
}

backupFirestore().catch((error) => {
  console.error('❌ Error en el respaldo:', error);
});
