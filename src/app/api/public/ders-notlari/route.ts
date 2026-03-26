import { NextResponse, type NextRequest } from "next/server";
import { getDocuments, orderBy } from "@/lib/firestore";
import type { DocumentData } from "firebase/firestore";

function serialize(docs: DocumentData[]) {
  return JSON.parse(JSON.stringify(docs));
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const collectionName = type === "mevzuat" ? "mevzuatDersNotlari" : "sbkyDersNotlari";
  const notes = await getDocuments(collectionName, [orderBy("createdAt", "desc")]);
  return NextResponse.json(
    { notes: serialize(notes) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
