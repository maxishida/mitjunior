import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkojqSAUoRkSwZwzS2SkyPnwqfsWdQ1m4",
  authDomain: "mitjunior.firebaseapp.com",
  projectId: "mitjunior",
  storageBucket: "mitjunior.appspot.com",
  messagingSenderId: "206479062777",
  appId: "1:206479062777:web:default",
};

// Initialize Firebase only on client side
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, db, storage };
