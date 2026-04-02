import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toTableName, toSnakeCase } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { collection, id } = await params;
    const table = toTableName(collection);
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const snakeData = toSnakeCase(body);
    delete snakeData.id;
    snakeData.updated_at = new Date().toISOString();

    const { error } = await supabase.from(table).update(snakeData).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin API] PUT error:", err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { collection, id } = await params;
    const table = toTableName(collection);
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin API] DELETE error:", err);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
