import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

if (!firebaseConfig.projectId) {
  console.error("[Firebase] NEXT_PUBLIC_FIREBASE_PROJECT_ID is empty — env vars may not be set");
}

let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;

function getApp() {
  if (!firebaseApp) {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return firebaseApp;
}

function getDb() {
  if (!firestoreDb) firestoreDb = getFirestore(getApp());
  return firestoreDb;
}

export {
  getApp as app,
  getDb as db,
};
