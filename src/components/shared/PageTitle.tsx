"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Reklam } from "@/types";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  hideAd?: boolean;
}

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

function AdBanner() {
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

  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-lg overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-dark hover:shadow-md transition-all"
    >
      <div className="py-2.5 px-4 flex items-center justify-center gap-4">
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <p className="text-white/70 text-xs">Reklam Alanı — Platformumuza destek olmak için iletişime geçin</p>
        <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-semibold rounded-md hover:bg-white/30 transition-colors shrink-0">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-lg overflow-hidden hover:shadow-md transition-all">
      {ad.imageUrl ? (
        <Image src={ad.imageUrl} alt={ad.title} width={1200} height={90} className="w-full h-auto object-cover rounded-lg" />
      ) : (
        <div className="w-full py-2.5 bg-gradient-to-r from-primary-dark via-primary to-primary-dark rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return <div className="mt-3">{ad ? adBanner : defaultBanner}</div>;
}

export default function PageTitle({ title, subtitle, hideAd }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center gap-1.5">
        <div className="w-12 h-1 bg-primary rounded-full animate-slide-in-left" />
        <div className="w-6 h-1 bg-primary/40 rounded-full animate-slide-in-left" style={{ animationDelay: "100ms" }} />
        <div className="w-3 h-1 bg-primary/20 rounded-full animate-slide-in-left" style={{ animationDelay: "200ms" }} />
      </div>
      {!hideAd && <AdBanner />}
    </div>
  );
}
