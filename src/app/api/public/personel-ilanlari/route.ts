import { NextResponse } from "next/server";
import { getDocuments, orderBy } from "@/lib/firestore";
import type { DocumentData } from "firebase/firestore";

function serialize(docs: DocumentData[]) {
  return JSON.parse(JSON.stringify(docs));
}

export async function GET() {
  const items = await getDocuments("personelIlanlari", [orderBy("createdAt", "desc")]);
  return NextResponse.json(
    { items: serialize(items) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
