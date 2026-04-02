import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", "hakkimizda")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return NextResponse.json(
      { data: data?.data || null },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[hakkimizda] error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", data: null }, { status: 500 });
  }
}
