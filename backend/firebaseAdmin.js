// firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }; // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
