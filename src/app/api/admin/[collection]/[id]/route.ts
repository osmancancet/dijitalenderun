import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toTableName, toSnakeCase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params;
    const table = toTableName(collection);
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const snakeData = toSnakeCase(body);
    delete snakeData.id;
    snakeData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(table)
      .update(snakeData)
      .eq("id", id);

    if (error) throw error;

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
    const table = toTableName(collection);
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin API] DELETE error:", err);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
