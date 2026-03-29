import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const maxDuration = 60;

const TARGET = "https://www.resmigazete.gov.tr/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "tr-TR,tr;q=0.9" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHtml(): Promise<string> {
  // 1. Doğrudan erişim dene
  try {
    const res = await fetchWithTimeout(TARGET, 10000);
    if (res.ok) return await res.text();
  } catch { /* devam */ }

  // 2. Proxy üzerinden dene
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${TARGET}`;
  try {
    const res = await fetchWithTimeout(proxyUrl, 15000);
    if (res.ok) return await res.text();
  } catch { /* devam */ }

  throw new Error("Resmi Gazete sitesine ne doğrudan ne de proxy üzerinden erişilemedi");
}

export async function GET() {
  try {
    const html = await fetchHtml();
    const $ = cheerio.load(html);

    // Tarih bilgisi — PDF linkinden çıkar
    const pdfLink = $("#btnPdfGoruntule").attr("href") || "";
    const dateMatch = pdfLink.match(/(\d{8})/);
    let formattedDate = "";
    if (dateMatch) {
      const d = dateMatch[1];
      formattedDate = `${d.slice(6, 8)}.${d.slice(4, 6)}.${d.slice(0, 4)}`;
    }

    const items: {
      title: string;
      summary: string;
      sourceUrl: string;
      date: string;
    }[] = [];

    let currentCategory = "";

    $(".card-title, .html-subtitle, .fihrist-item").each((_, el) => {
      const $el = $(el);

      if ($el.hasClass("card-title")) {
        currentCategory = $el.text().trim();
        return;
      }

      if ($el.hasClass("html-subtitle")) {
        currentCategory = $el.text().trim();
        return;
      }

      if ($el.hasClass("fihrist-item")) {
        const $a = $el.find("a");
        const href = $a.attr("href") || "";
        let text = $a.text().trim().replace(/\s+/g, " ");
        text = text.replace(/^[–—\-\s]+/, "").trim();

        if (text && href) {
          items.push({
            title: text,
            summary: currentCategory || (formattedDate ? `${formattedDate} tarihli Resmî Gazete` : "Resmî Gazete"),
            sourceUrl: href,
            date: formattedDate,
          });
        }
      }
    });

    const mevzuatItems = items.filter((item) =>
      !item.sourceUrl.includes("/ilanlar/")
    );

    return NextResponse.json({
      items: mevzuatItems,
      count: mevzuatItems.length,
      allItems: items,
      allCount: items.length,
      date: formattedDate,
    });
  } catch (error) {
    console.error("Resmi Gazete sync hatası:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: detail },
      { status: 502 }
    );
  }
}
