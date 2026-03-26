import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase-storage";

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage(), path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage(), url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Dosya silinirken hata:", error);
  }
}

export function generateFilePath(folder: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${folder}/${timestamp}_${sanitized}`;
}
