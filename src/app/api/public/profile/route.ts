import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", "drOzanYetkin")
    .single();

  return NextResponse.json(
    { profile: data?.data || null },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
