import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

function getAdminApp(): App {
  if (!app) {
    if (getApps().length > 0) {
      app = getApps()[0];
    } else {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
      }
      const decoded = JSON.parse(
        Buffer.from(serviceAccount, "base64").toString("utf-8")
      );
      app = initializeApp({ credential: cert(decoded) });
    }
  }
  return app;
}

export function getAdminDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}
