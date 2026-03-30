"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Reklam } from "@/types";

const MAIN_PAGES = [
  "/",
  "/sbky-ders-notlari",
  "/sbky-sozluk",
  "/mevzuat-ders-notlari",
  "/biyografiler",
  "/dr-ozan-yetkin",
  "/hakkimizda",
  "/iletisim",
];

export default function SideAdBanner({ side }: { side: "left" | "right" }) {
  const pathname = usePathname();
  const [ad, setAd] = useState<Reklam | null>(null);

  // Strip locale prefix (e.g. /tr/biyografiler -> /biyografiler)
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  const isMainPage = MAIN_PAGES.includes(cleanPath);

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
      className="block w-[160px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03] bg-gradient-to-b from-primary-dark via-primary to-primary-dark"
    >
      <div className="py-24 px-4 text-center flex flex-col items-center gap-10">
        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-white/90 text-xs font-bold uppercase tracking-widest">Reklam</p>
          <p className="text-white/90 text-xs font-bold uppercase tracking-widest">Alanı</p>
        </div>
        <div className="w-12 h-px bg-white/30" />
        <p className="text-white/50 text-[10px] leading-relaxed px-1">
          Bu alanda reklam vererek platformumuza destek olabilirsiniz
        </p>
        <span className="px-4 py-2 bg-white/20 text-white text-[10px] font-semibold rounded-lg hover:bg-white/30 transition-colors">
          İletişime Geçin
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.03] transition-transform">
      {ad.imageUrl ? (
        <div className="w-[160px] rounded-xl overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={160} height={600} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-[160px] h-[600px] bg-gradient-to-b from-primary-dark via-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold text-center px-3">{ad.title}</span>
        </div>
      )}
    </a>
  );

  if (isMainPage) return null;

  return (
    <div className={`hidden 2xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-6" : "right-6"}`}>
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
