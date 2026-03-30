import { NextResponse } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const [sliderRes, gazetteRes, ilanlariRes, videolarRes] = await Promise.all([
      supabase.from("slider").select("*").order("order", { ascending: true }).limit(10),
      supabase.from("resmi_gazete").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("personel_ilanlari").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("videolar").select("*").order("order", { ascending: true }).limit(12),
    ]);

    return NextResponse.json(
      {
        slider: (sliderRes.data || []).map(toCamelCase),
        resmiGazete: (gazetteRes.data || []).map(toCamelCase),
        personelIlanlari: (ilanlariRes.data || []).map(toCamelCase),
        videolar: (videolarRes.data || []).map(toCamelCase),
      },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    console.error("[homepage API] error:", err);
    return NextResponse.json(
      { error: "Veri yüklenemedi", slider: [], resmiGazete: [], personelIlanlari: [], videolar: [] },
      { status: 500 }
    );
  }
}
