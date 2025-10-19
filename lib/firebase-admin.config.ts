import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: "mitjunior",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
  clientId: process.env.FIREBASE_CLIENT_ID || ""
};

// Initialize Firebase Admin
let app: any = null;
let auth: any = null;
let db: any = null;

if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export { app, auth, db };