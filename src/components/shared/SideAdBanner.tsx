"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Reklam } from "@/types";

export default function SideAdBanner({ side }: { side: "left" | "right" }) {
  const [ad, setAd] = useState<Reklam | null>(null);

  useEffect(() => {
    fetch("/api/public/reklamlar")
      .then((r) => r.json())
      .then((d) => {
        const items = (d.items || []) as Reklam[];
        const match = items.find((i) => i.position === side || i.position === "both");
        setAd(match ?? null);
      })
      .catch(() => {});
  }, [side]);

  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-[140px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03] bg-gradient-to-b from-primary-dark via-primary to-primary-dark"
    >
      <div className="py-10 px-3 text-center flex flex-col items-center gap-5">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest">Reklam</p>
          <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest">Alanı</p>
        </div>
        <div className="w-8 h-px bg-white/30" />
        <p className="text-white/50 text-[9px] leading-relaxed px-1">
          Bu alanda reklam vererek platformumuza destek olabilirsiniz
        </p>
        <span className="px-3 py-1.5 bg-white/20 text-white text-[9px] font-semibold rounded-md hover:bg-white/30 transition-colors">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.03] transition-transform">
      {ad.imageUrl ? (
        <div className="w-[140px] rounded-xl overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={140} height={500} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-[140px] h-[450px] bg-gradient-to-b from-primary-dark via-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold text-center px-3">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return (
    <div className={`hidden 2xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-6" : "right-6"}`}>
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
