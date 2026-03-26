import { NextResponse, type NextRequest } from "next/server";
import { getDocuments, addDocument } from "@/lib/firestore-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const items = await getDocuments(collection, {
      orderBy: { field: "createdAt", direction: "desc" },
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin API] GET error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", items: [] }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const data = await request.json();
    const id = await addDocument(collection, data);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("[admin API] POST error:", err);
    return NextResponse.json({ error: "Kayıt eklenemedi" }, { status: 500 });
  }
}
