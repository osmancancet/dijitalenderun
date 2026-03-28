import { NextResponse } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("sbky_sozluk")
    .select("*")
    .order("term", { ascending: true });

  return NextResponse.json(
    { items: (data || []).map(toCamelCase) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
