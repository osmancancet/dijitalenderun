import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/firestore-admin";

export async function GET() {
  const posts = await getDocuments("blog", { orderBy: { field: "createdAt", direction: "desc" } });
  return NextResponse.json(
    { posts },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
