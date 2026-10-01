import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// In Netlify or custom deployment, these can be set via VITE_FIREBASE_* environment variables.
// Fallback defaults point to the verified project configuration.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_piEigbc_CqJVhzLLqpSsTdNcwaWlzC8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tactile-idiom-k8gvj.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tactile-idiom-k8gvj",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tactile-idiom-k8gvj.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "471385582166",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:471385582166:web:3d81827872e628b974e9f7",
};

let app: FirebaseApp | any = null;
let dbInstance: Firestore | any = null;
let authInstance: Auth | any = null;
let storageInstance: FirebaseStorage | any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  // Dedicated database ID used in AI Studio, with fallback to default Firestore database
  const targetDb = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-baligroupsilosco-d980d16b-5def-440c-af77-a2588568e65b";
  try {
    dbInstance = getFirestore(app, targetDb);
  } catch (namedDbErr) {
    console.warn(`[Firebase] Could not access database "${targetDb}", falling back to default Firestore:`, namedDbErr);
    try {
      dbInstance = getFirestore(app);
    } catch (defaultDbErr) {
      console.warn("[Firebase] Could not initialize default Firestore database:", defaultDbErr);
    }
  }

  try {
    authInstance = getAuth(app);
  } catch (authErr) {
    console.warn("[Firebase] Auth initialization warning:", authErr);
  }

  try {
    storageInstance = getStorage(app);
  } catch (storageErr) {
    console.warn("[Firebase] Storage initialization warning:", storageErr);
  }
} catch (err) {
  console.error("[Firebase] Initialization error caught safely; website will render with local fallbacks:", err);
}

export const db: Firestore = dbInstance;
export const auth: Auth = authInstance;
export const storage: FirebaseStorage = storageInstance;
export const googleProvider = new GoogleAuthProvider();
