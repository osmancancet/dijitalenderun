import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const TABLES = {
  slider: "slider",
  resmiGazete: "resmi_gazete",
  personelIlanlari: "personel_ilanlari",
  sbkyDersNotlari: "sbky_ders_notlari",
  mevzuatDersNotlari: "mevzuat_ders_notlari",
  sbkySozluk: "sbky_sozluk",
  videolar: "videolar",
  biyografiler: "biyografiler",
  reklamlar: "reklamlar",
  contactMessages: "contact_messages",
} as const;

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const countPromises = Object.entries(TABLES).map(async ([key, table]) => {
      const { count, error } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });

      if (error) {
        console.error(`[stats] Error counting ${table}:`, error.message);
        return [key, 0] as const;
      }
      return [key, count ?? 0] as const;
    });

    // Unread contact messages count
    const unreadPromise = supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    const [counts, unreadResult] = await Promise.all([
      Promise.all(countPromises),
      unreadPromise,
    ]);

    const stats: Record<string, number> = {};
    for (const [key, count] of counts) {
      stats[key] = count;
    }
    stats.unreadMessages = unreadResult.count ?? 0;

    // Total content count (excluding contact messages)
    stats.totalContent = Object.entries(stats)
      .filter(([key]) => key !== "contactMessages" && key !== "unreadMessages")
      .reduce((sum, [, val]) => sum + val, 0);

    return NextResponse.json(stats);
  } catch (err) {
    console.error("[stats] Error:", err);
    return NextResponse.json({ error: "İstatistikler yüklenemedi" }, { status: 500 });
  }
}
