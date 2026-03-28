import type { MetadataRoute } from "next";

const BASE_URL = "https://dijitalenderun.gov";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/sbky-ders-notlari",
    "/sbky-sozluk",
    "/mevzuat-ders-notlari",
    "/dr-ozan-yetkin",
    "/hakkimizda",
    "/iletisim",
    "/resmi-gazete",
    "/personel-ilanlari",
  ];

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
