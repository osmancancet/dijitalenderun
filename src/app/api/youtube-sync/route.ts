import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCuQgPPKosXLroyOg6ypi21w";
const CHANNEL_HANDLE = "dijitalenderun";

// Shorts sayfasından shorts ID'lerini çek
async function getShortsIds(): Promise<Set<string>> {
  const shortsIds = new Set<string>();
  try {
    const res = await fetch(`https://www.youtube.com/@${CHANNEL_HANDLE}/shorts`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
    });
    if (res.ok) {
      const html = await res.text();
      const matches = html.matchAll(/\/shorts\/([a-zA-Z0-9_-]{11})/g);
      for (const match of matches) {
        shortsIds.add(match[1]);
      }
    }
  } catch (e) {
    console.error("Shorts sayfası alınamadı:", e);
  }
  return shortsIds;
}

// oEmbed ile dikey video kontrolü (fallback)
async function isShortByOembed(videoId: string): Promise<boolean> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.width && data.height) {
        return data.height > data.width;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

// RSS feed'den tüm videoları çek
async function fetchRSSEntries(): Promise<{ title: string; videoId: string; description: string; published: string }[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const response = await fetch(feedUrl, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error("RSS feed alınamadı");

  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const entries: { title: string; videoId: string; description: string; published: string }[] = [];

  $("entry").each((_, el) => {
    const title = $(el).find("title").text().trim();
    const videoId = $(el).find("yt\\:videoId").text().trim();
    const description = $(el).find("media\\:description").text().trim();
    const published = $(el).find("published").text().trim();
    if (title && videoId) {
      entries.push({ title, videoId, description, published });
    }
  });

  return entries;
}

// GET /api/youtube-sync?type=video|short
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "video" | "short" | null (all)

    const entries = await fetchRSSEntries();
    const knownShortsIds = await getShortsIds();

    const videos: {
      title: string;
      youtubeUrl: string;
      description: string;
      videoType: "video" | "short";
      publishedAt: string;
    }[] = [];

    for (const entry of entries) {
      let isShort = knownShortsIds.has(entry.videoId);
      if (!isShort) {
        isShort = await isShortByOembed(entry.videoId);
      }

      const videoType = isShort ? "short" : "video";

      // Filter by type if specified
      if (type && videoType !== type) continue;

      videos.push({
        title: entry.title,
        youtubeUrl: isShort
          ? `https://www.youtube.com/shorts/${entry.videoId}`
          : `https://www.youtube.com/watch?v=${entry.videoId}`,
        description: entry.description.slice(0, 200),
        videoType,
        publishedAt: entry.published,
      });
    }

    return NextResponse.json({
      videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("YouTube sync hatası:", error);
    return NextResponse.json(
      { error: "YouTube videoları alınırken hata oluştu" },
      { status: 500 }
    );
  }
}
