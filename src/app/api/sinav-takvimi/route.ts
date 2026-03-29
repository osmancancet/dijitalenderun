import { NextResponse } from "next/server";

// ÖSYM 2026 sınav takvimi (statik veri — ÖSYM sitesi JS ile render ettiği için scrape edilemiyor)
// Kaynak: https://www.osym.gov.tr/TR,33867/2026.html
const OSYM_2026 = [
  { title: "e-YDS 2026/1 (İngilizce)", examDate: "2026-01-24", applicationDeadline: "2026-01-15", sourceUrl: "https://www.osym.gov.tr/TR,13493/yks.html" },
  { title: "MSÜ Askeri Öğrenci Aday Belirleme Sınavı", examDate: "2026-03-01", applicationDeadline: "2026-02-13", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
  { title: "ALES 2026/1", examDate: "2026-03-22", applicationDeadline: "2026-02-27", sourceUrl: "https://www.osym.gov.tr/TR,125/ales.html" },
  { title: "YÖKDİL 2026/1", examDate: "2026-04-05", applicationDeadline: "2026-03-13", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
  { title: "DGS 2026", examDate: "2026-05-31", applicationDeadline: "2026-04-21", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
  { title: "YKS (TYT-AYT-YDT) 2026", examDate: "2026-06-13", applicationDeadline: "2026-04-10", sourceUrl: "https://www.osym.gov.tr/TR,13493/yks.html" },
  { title: "KPSS Genel Yetenek-Genel Kültür / Eğitim Bilimleri", examDate: "2026-07-25", applicationDeadline: "2026-06-19", sourceUrl: "https://www.osym.gov.tr/TR,62/kpss.html" },
  { title: "KPSS Alan Bilgisi", examDate: "2026-07-26", applicationDeadline: "2026-06-19", sourceUrl: "https://www.osym.gov.tr/TR,62/kpss.html" },
  { title: "e-YDS 2026/2 (İngilizce)", examDate: "2026-08-09", applicationDeadline: "2026-07-24", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
  { title: "ALES 2026/2", examDate: "2026-09-20", applicationDeadline: "2026-08-28", sourceUrl: "https://www.osym.gov.tr/TR,125/ales.html" },
  { title: "EKPSS 2026", examDate: "2026-10-11", applicationDeadline: "2026-09-12", sourceUrl: "https://www.osym.gov.tr/TR,97/ekpss.html" },
  { title: "YÖKDİL 2026/2", examDate: "2026-11-08", applicationDeadline: "2026-10-16", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
  { title: "e-YDS 2026/3 (İngilizce)", examDate: "2026-12-06", applicationDeadline: "2026-11-20", sourceUrl: "https://www.osym.gov.tr/TR,8797/takvim.html" },
];

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = OSYM_2026.filter((exam) => exam.examDate >= today);

  return NextResponse.json({
    items: upcoming,
    count: upcoming.length,
    allCount: OSYM_2026.length,
  }, {
    headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=172800" },
  });
}
