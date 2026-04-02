import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const table = type === "mevzuat" ? "mevzuat_ders_notlari" : "sbky_ders_notlari";

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      { notes: (data || []).map(toCamelCase) },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[ders-notlari] error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", notes: [] }, { status: 500 });
  }
}
