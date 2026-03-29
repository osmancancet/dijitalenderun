import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const maxDuration = 60;

const TARGET = "https://www.osym.gov.tr/TR,8797/takvim.html";
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
  try {
    const res = await fetchWithTimeout(TARGET, 10000);
    if (res.ok) return await res.text();
  } catch { /* fallback */ }

  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${TARGET}`;
  try {
    const res = await fetchWithTimeout(proxyUrl, 15000);
    if (res.ok) return await res.text();
  } catch { /* fallback */ }

  throw new Error("ÖSYM sitesine erişilemedi");
}

function parseDate(text: string): string | null {
  const match = text.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export async function GET() {
  try {
    const html = await fetchHtml();
    const $ = cheerio.load(html);

    const currentYear = new Date().getFullYear();
    const items: {
      title: string;
      examDate: string;
      applicationDeadline: string | null;
      sourceUrl: string;
    }[] = [];

    $("div.row").each((_, el) => {
      const $row = $(el);
      const $h6 = $row.find("div.col-sm-4 h6");
      if ($h6.length === 0) return;

      const title = $h6.text().trim();
      const $link = $row.find("div.col-sm-4 a");
      const href = $link.attr("href") || "";
      const sourceUrl = href.startsWith("http") ? href : `https://www.osym.gov.tr${href}`;

      const cols = $row.find("div.col-sm-2");
      const examDateText = cols.eq(0).text();
      const appDateText = cols.eq(1).text();

      const examDate = parseDate(examDateText);
      if (!examDate) return;

      // Sadece bu yıl ve gelecek sınavları al
      const examYear = parseInt(examDate.slice(0, 4));
      if (examYear < currentYear) return;

      // Başvuru son tarihi — ikinci tarihi al (bitiş)
      const appDates = appDateText.match(/(\d{2}\.\d{2}\.\d{4})/g);
      const applicationDeadline = appDates && appDates.length >= 2 ? parseDate(appDates[1]) : appDates ? parseDate(appDates[0]) : null;

      items.push({ title, examDate, applicationDeadline, sourceUrl });
    });

    // Tarihe göre sırala
    items.sort((a, b) => a.examDate.localeCompare(b.examDate));

    // Sadece gelecekteki sınavları filtrele
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = items.filter((i) => i.examDate >= today);

    return NextResponse.json({
      items: upcoming,
      count: upcoming.length,
      allCount: items.length,
    }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (error) {
    console.error("ÖSYM sync hatası:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
