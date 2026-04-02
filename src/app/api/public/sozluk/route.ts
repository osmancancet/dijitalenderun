import { NextResponse } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("sbky_sozluk")
      .select("*")
      .eq("is_active", true)
      .order("term", { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      { items: (data || []).map(toCamelCase) },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[sozluk] error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", items: [] }, { status: 500 });
  }
}
