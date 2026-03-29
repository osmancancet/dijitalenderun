import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toCamelCase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = getSupabaseAdmin();
  const search = `%${q}%`;

  const [sbky, mevzuat, sozluk] = await Promise.all([
    supabase.from("sbky_ders_notlari").select("id, title, category").eq("is_active", true).ilike("title", search).limit(5),
    supabase.from("mevzuat_ders_notlari").select("id, title, category").eq("is_active", true).ilike("title", search).limit(5),
    supabase.from("sbky_sozluk").select("id, term, definition").eq("is_active", true).ilike("term", search).limit(5),
  ]);

  const results = [
    ...(sbky.data || []).map((r) => ({ ...toCamelCase(r), type: "sbky" as const, url: `/sbky-ders-notlari/${r.id}` })),
    ...(mevzuat.data || []).map((r) => ({ ...toCamelCase(r), type: "mevzuat" as const, url: `/mevzuat-ders-notlari/${r.id}` })),
    ...(sozluk.data || []).map((r) => ({ ...toCamelCase(r), type: "sozluk" as const, url: `/sbky-sozluk` })),
  ];

  return NextResponse.json({ results });
}
