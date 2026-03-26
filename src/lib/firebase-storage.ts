import { getStorage, type FirebaseStorage } from "firebase/storage";
import { app } from "./firebase";

let firebaseStorage: FirebaseStorage;

export function storage() {
  if (!firebaseStorage) firebaseStorage = getStorage(app());
  return firebaseStorage;
}
