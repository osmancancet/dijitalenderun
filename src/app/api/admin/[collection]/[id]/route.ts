import { NextResponse, type NextRequest } from "next/server";
import { updateDocument, deleteDocument } from "@/lib/firestore-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params;
    const data = await request.json();
    await updateDocument(collection, id, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin API] PUT error:", err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params;
    await deleteDocument(collection, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin API] DELETE error:", err);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
