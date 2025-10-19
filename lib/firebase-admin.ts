import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // For development, use service account
    if (process.env.NODE_ENV === 'development') {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || "mitjunior",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      if (serviceAccount.clientEmail && serviceAccount.privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as any),
          projectId: serviceAccount.projectId,
        });
      } else {
        // Fallback for local development without service account
        console.warn('Firebase Admin credentials not found, using application default credentials');
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || "mitjunior",
        });
      }
    } else {
      // Production environment
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "mitjunior",
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// Configure Firestore settings for performance
db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true,
});

export default admin;