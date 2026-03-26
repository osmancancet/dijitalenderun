import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  setDoc,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  try {
    const ref = collection(db(), collectionName);
    const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string }));
  } catch (err) {
    console.error(`Firestore okuma hatası [${collectionName}]:`, err);
    return [];
  }
}

export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  try {
    const ref = doc(db(), collectionName, docId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
  } catch (err) {
    console.error(`Firestore doc okuma hatası [${collectionName}/${docId}]:`, err);
    return null;
  }
}

export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const ref = collection(db(), collectionName);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  const ref = doc(db(), collectionName, docId);
  await updateDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const ref = doc(db(), collectionName, docId);
  await deleteDoc(ref);
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  const ref = doc(db(), collectionName, docId);
  await setDoc(ref, { ...data, updatedAt: Timestamp.now() }, { merge: true });
}

export { where, orderBy, limit, Timestamp, collection, query };
