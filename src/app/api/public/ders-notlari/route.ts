import { NextResponse, type NextRequest } from "next/server";
import { getDocuments } from "@/lib/firestore-admin";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const collectionName = type === "mevzuat" ? "mevzuatDersNotlari" : "sbkyDersNotlari";
  const notes = await getDocuments(collectionName, { orderBy: { field: "createdAt", direction: "desc" } });
  return NextResponse.json(
    { notes },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
