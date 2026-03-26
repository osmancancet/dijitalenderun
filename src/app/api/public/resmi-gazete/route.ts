import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/firestore-admin";

export async function GET() {
  const items = await getDocuments("resmiGazete", { orderBy: { field: "createdAt", direction: "desc" } });
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
