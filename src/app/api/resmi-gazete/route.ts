import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const maxDuration = 15;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function GET() {
  try {
    // Ana sayfayı çek — fihrist zaten burada mevcut
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let res: Response;
    try {
      res = await fetch("https://www.resmigazete.gov.tr/", {
        headers: { "User-Agent": UA, "Accept-Language": "tr-TR,tr;q=0.9" },
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const msg = fetchErr instanceof Error && fetchErr.name === "AbortError"
        ? "Resmi Gazete sitesine bağlanırken zaman aşımı oluştu (10s)"
        : `Resmi Gazete sitesine bağlanılamadı: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      return NextResponse.json({ error: `Resmi Gazete ana sayfası alınamadı (HTTP ${res.status})` }, { status: 502 });
    }

    const html = await res.text();
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

    // Kategori başlıkları (YÜRÜTME VE İDARE BÖLÜMÜ, YARGI BÖLÜMÜ, vs.)
    let currentCategory = "";

    // card-title = bölüm başlığı, html-subtitle = alt başlık, fihrist-item = madde
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
        // "–– " prefix temizle
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

    // İlan bölümünü hariç tut (sadece mevzuat kısmını al)
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
      { error: `Resmi Gazete verileri alınırken hata oluştu: ${detail}` },
      { status: 500 }
    );
  }
}
