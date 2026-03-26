import { NextResponse, type NextRequest } from "next/server";
import { getDocument, setDocument } from "@/lib/firestore-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const doc = await getDocument("siteSettings", docId);
    return NextResponse.json({ data: doc });
  } catch (err) {
    console.error("[admin settings API] GET error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", data: null }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const data = await request.json();
    await setDocument("siteSettings", docId, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin settings API] PUT error:", err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
