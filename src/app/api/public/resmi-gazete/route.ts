import { NextResponse } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("resmi_gazete")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      { items: (data || []).map(toCamelCase) },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[resmi-gazete] error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", items: [] }, { status: 500 });
  }
}
