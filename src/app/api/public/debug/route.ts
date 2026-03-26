import { NextResponse } from "next/server";
import { collection, getDocs, query, limit as firestoreLimit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(empty)";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "(empty)";

  const results: Record<string, unknown> = {
    projectId,
    apiKeySet: apiKey !== "(empty)" && apiKey.length > 0,
    apiKeyLen: apiKey.length,
    nodeEnv: process.env.NODE_ENV,
  };

  // Try direct Firestore read on multiple collections
  try {
    const firestore = db();
    results.firestoreOk = true;

    const collections = ["videolar", "resmiGazete", "personelIlanlari", "slider", "blog"];
    for (const col of collections) {
      try {
        const ref = collection(firestore, col);
        const q = query(ref, firestoreLimit(2));
        const snapshot = await getDocs(q);
        results[col] = { count: snapshot.size, ids: snapshot.docs.map((d) => d.id) };
      } catch (err) {
        results[col] = { error: String(err) };
      }
    }
  } catch (err) {
    results.firestoreOk = false;
    results.firestoreError = String(err);
  }

  return NextResponse.json(results);
}
