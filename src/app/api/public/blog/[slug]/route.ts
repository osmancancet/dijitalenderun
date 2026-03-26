import { NextResponse, type NextRequest } from "next/server";
import { queryDocuments } from "@/lib/firestore-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const docs = await queryDocuments("blog", "slug", slug);

  if (docs.length === 0) {
    return NextResponse.json({ post: null }, { status: 404 });
  }

  return NextResponse.json(
    { post: docs[0] },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
