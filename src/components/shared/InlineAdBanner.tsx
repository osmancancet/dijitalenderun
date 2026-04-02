"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Reklam } from "@/types";

function getPageSlug(pathname: string): string {
  const clean = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  if (clean === "/") return "home";
  const segments = clean.split("/").filter(Boolean);
  return segments[0];
}

function isAdInDateRange(ad: Reklam): boolean {
  const now = new Date().toISOString().slice(0, 10);
  if (ad.startDate && ad.startDate.slice(0, 10) > now) return false;
  if (ad.endDate && ad.endDate.slice(0, 10) < now) return false;
  return true;
}

const HIDDEN_PAGES = ["home", "dr-ozan-yetkin"];

export default function InlineAdBanner() {
  const pathname = usePathname();
  const [ad, setAd] = useState<Reklam | null>(null);
  const pageSlug = getPageSlug(pathname);

  useEffect(() => {
    fetch("/api/public/reklamlar")
      .then((r) => r.json())
      .then((d) => {
        const items = (d.items || []) as Reklam[];
        const match = items.find((i) => {
          if (i.position === "horizontal") return false;
          const pages = i.pages || ["all"];
          const pageMatch = pages.includes("all") || pages.includes(pageSlug);
          return pageMatch && isAdInDateRange(i);
        });
        setAd(match ?? null);
      })
      .catch(() => {});
  }, [pageSlug]);

  if (HIDDEN_PAGES.includes(pageSlug)) return null;

  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-lg overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-dark hover:shadow-lg transition-all"
    >
      <div className="py-3 px-4 flex items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <p className="text-white/80 text-xs font-medium">Reklam Alanı — Platformumuza destek olmak için iletişime geçin</p>
        <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-semibold rounded-md hover:bg-white/30 transition-colors shrink-0">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-lg overflow-hidden hover:shadow-lg transition-all">
      {ad.imageUrl ? (
        <Image src={ad.imageUrl} alt={ad.title} width={1200} height={100} className="w-full h-auto object-cover rounded-lg" />
      ) : (
        <div className="w-full py-3 bg-gradient-to-r from-primary-dark via-primary to-primary-dark rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-2 mb-4">
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
