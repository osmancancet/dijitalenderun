import { NextResponse } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("reklamlar")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return NextResponse.json(
    { items: (data || []).map(toCamelCase) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
