import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getAuthInstance as auth } from "./firebase-auth";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth(), email, password);
}

export async function signOut() {
  return firebaseSignOut(auth());
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth(), callback);
}

export { type User };
