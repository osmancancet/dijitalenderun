import type { MetadataRoute } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

const BASE_URL = "https://dijitalenderun.org";
const LOCALES = ["tr", "en", "ar", "de"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/sbky-ders-notlari", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/mevzuat-ders-notlari", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/sbky-sozluk", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/resmi-gazete", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/personel-ilanlari", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/dr-ozan-yetkin", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/hakkimizda", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/iletisim", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/gizlilik-politikasi", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Statik sayfalar — tüm dillerde
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );

  // Dinamik sayfalar — ders notları
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseAdmin();
    const [sbkyRes, mevzuatRes] = await Promise.all([
      supabase.from("sbky_ders_notlari").select("id, updated_at").eq("is_active", true),
      supabase.from("mevzuat_ders_notlari").select("id, updated_at").eq("is_active", true),
    ]);

    const sbkyNotes = (sbkyRes.data || []).flatMap((note) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}/sbky-ders-notlari/${note.id}`,
        lastModified: new Date(note.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );

    const mevzuatNotes = (mevzuatRes.data || []).flatMap((note) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}/mevzuat-ders-notlari/${note.id}`,
        lastModified: new Date(note.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );

    dynamicEntries = [...sbkyNotes, ...mevzuatNotes];
  } catch {
    // Supabase hatası durumunda sadece statik sayfaları döndür
  }

  return [...staticEntries, ...dynamicEntries];
}
