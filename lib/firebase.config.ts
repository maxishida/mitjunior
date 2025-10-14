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
  appId: "COLOQUE_SEU_APP_ID_AQUI",
};

// Inicializa o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
