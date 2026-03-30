"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Reklam } from "@/types";

export default function HorizontalAdBanner() {
  const [ad, setAd] = useState<Reklam | null>(null);

  useEffect(() => {
    fetch("/api/public/reklamlar")
      .then((r) => r.json())
      .then((d) => {
        const items = (d.items || []) as Reklam[];
        const match = items.find((i) => i.position === "both" || i.position === "left");
        setAd(match ?? null);
      })
      .catch(() => {});
  }, []);

  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.005] bg-gradient-to-r from-primary-dark via-primary to-primary-dark"
    >
      <div className="py-4 px-6 flex items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-white/90 text-sm font-bold uppercase tracking-widest">Reklam Alanı</p>
          <div className="w-px h-6 bg-white/30" />
          <p className="text-white/50 text-xs">
            Bu alanda reklam vererek platformumuza destek olabilirsiniz
          </p>
        </div>
        <span className="px-4 py-2 bg-white/20 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-colors shrink-0">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full hover:scale-[1.005] transition-transform">
      {ad.imageUrl ? (
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={1200} height={120} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-full h-[90px] bg-gradient-to-r from-primary-dark via-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return (
    <div className="mt-6">
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
