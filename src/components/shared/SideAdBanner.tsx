"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Reklam } from "@/types";

function getPageSlug(pathname: string): string {
  const clean = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  if (clean === "/") return "home";
  // For detail pages like /biyografiler/max-weber, use the parent: biyografiler
  const segments = clean.split("/").filter(Boolean);
  return segments[0];
}

function isAdVisibleOnPage(ad: Reklam, pageSlug: string): boolean {
  if (!ad.pages || ad.pages.length === 0 || ad.pages.includes("all")) return true;
  return ad.pages.includes(pageSlug);
}

function isAdInDateRange(ad: Reklam): boolean {
  const now = new Date().toISOString().slice(0, 10);
  if (ad.startDate && ad.startDate.slice(0, 10) > now) return false;
  if (ad.endDate && ad.endDate.slice(0, 10) < now) return false;
  return true;
}

export default function SideAdBanner({ side }: { side: "left" | "right" }) {
  const pathname = usePathname();
  const [ad, setAd] = useState<Reklam | null>(null);
  const pageSlug = getPageSlug(pathname);

  useEffect(() => {
    fetch("/api/public/reklamlar")
      .then((r) => r.json())
      .then((d) => {
        const items = (d.items || []) as Reklam[];
        const match = items.find(
          (i) => (i.position === side || i.position === "both") && isAdVisibleOnPage(i, pageSlug) && isAdInDateRange(i)
        );
        setAd(match ?? null);
      })
      .catch(() => {});
  }, [side, pageSlug]);

  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-[140px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03] bg-gradient-to-b from-primary-dark via-primary to-primary-dark max-h-[80vh]"
    >
      <div className="py-16 px-3 text-center flex flex-col items-center gap-8">
        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="text-white/90 text-[11px] font-bold uppercase tracking-widest">Reklam</p>
          <p className="text-white/90 text-[11px] font-bold uppercase tracking-widest">Alanı</p>
        </div>
        <div className="w-10 h-px bg-white/30" />
        <p className="text-white/50 text-[9px] leading-relaxed px-1">
          Bu alanda reklam vererek platformumuza destek olabilirsiniz
        </p>
        <span className="px-3 py-1.5 bg-white/20 text-white text-[9px] font-semibold rounded-lg hover:bg-white/30 transition-colors">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.03] transition-transform">
      {ad.imageUrl ? (
        <div className="w-[140px] max-h-[80vh] rounded-xl overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={140} height={500} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-[140px] h-[500px] max-h-[80vh] bg-gradient-to-b from-primary-dark via-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold text-center px-3">{ad.title}</span>
        </div>
      )}
    </a>
  );

  // Ana sayfada side banner gösterme (orada yatay banner var)
  if (pageSlug === "home") return null;

  return (
    <div className={`hidden 2xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-2" : "right-2"}`}>
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
