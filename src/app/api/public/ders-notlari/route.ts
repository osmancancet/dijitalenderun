import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const table = type === "mevzuat" ? "mevzuat_ders_notlari" : "sbky_ders_notlari";

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("is_active", true)
    .not("status", "eq", "draft")
    .order("created_at", { ascending: false });

  return NextResponse.json(
    { notes: (data || []).map(toCamelCase) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
