import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", docId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return NextResponse.json({ data: data?.data || null });
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
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        id: docId,
        data: body,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin settings API] PUT error:", err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
