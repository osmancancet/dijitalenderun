import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/firestore-admin";

export async function GET() {
  const results: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    serviceAccountSet: !!process.env.FIREBASE_SERVICE_ACCOUNT,
  };

  try {
    const collections = ["videolar", "resmiGazete", "personelIlanlari", "slider", "blog"];
    for (const col of collections) {
      try {
        const docs = await getDocuments(col, { limit: 2 });
        results[col] = { count: docs.length, ids: docs.map((d) => d.id) };
      } catch (err) {
        results[col] = { error: String(err) };
      }
    }
  } catch (err) {
    results.error = String(err);
  }

  return NextResponse.json(results);
}
