import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const results: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };

  const tables = ["videolar", "resmi_gazete", "personel_ilanlari", "slider"];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("id").limit(2);
      if (error) {
        results[table] = { error: error.message };
      } else {
        results[table] = { count: data?.length || 0, ids: data?.map((d) => d.id) || [] };
      }
    } catch (err) {
      results[table] = { error: String(err) };
    }
  }

  return NextResponse.json(results);
}
