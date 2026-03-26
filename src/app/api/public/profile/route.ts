import { NextResponse } from "next/server";
import { getDocument } from "@/lib/firestore";
import type { DocumentData } from "firebase/firestore";

export async function GET() {
  const doc = await getDocument<DocumentData>("siteSettings", "drOzanYetkin");
  const profile = doc ? JSON.parse(JSON.stringify(doc)) : null;
  return NextResponse.json(
    { profile },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
