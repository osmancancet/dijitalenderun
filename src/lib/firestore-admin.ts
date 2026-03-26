import { getAdminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function getDocuments(
  collectionName: string,
  options?: { orderBy?: { field: string; direction?: "asc" | "desc" }; limit?: number }
): Promise<({ id: string } & Record<string, unknown>)[]> {
  const db = getAdminDb();
  let ref: FirebaseFirestore.Query = db.collection(collectionName);

  if (options?.orderBy) {
    ref = ref.orderBy(options.orderBy.field, options.orderBy.direction || "asc");
  }
  if (options?.limit) {
    ref = ref.limit(options.limit);
  }

  const snapshot = await ref.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getDocument(
  collectionName: string,
  docId: string
): Promise<({ id: string } & Record<string, unknown>) | null> {
  const db = getAdminDb();
  const snapshot = await db.collection(collectionName).doc(docId).get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function addDocument(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  const db = getAdminDb();
  const ref = await db.collection(collectionName).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const db = getAdminDb();
  await db
    .collection(collectionName)
    .doc(docId)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const db = getAdminDb();
  await db.collection(collectionName).doc(docId).delete();
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const db = getAdminDb();
  await db
    .collection(collectionName)
    .doc(docId)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function queryDocuments(
  collectionName: string,
  field: string,
  value: unknown
): Promise<({ id: string } & Record<string, unknown>)[]> {
  const db = getAdminDb();
  const snapshot = await db
    .collection(collectionName)
    .where(field, "==", value)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
