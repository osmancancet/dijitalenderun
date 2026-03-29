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
      className="block w-[80px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-b from-primary-dark to-primary"
    >
      <div className="py-6 px-2 text-center flex flex-col items-center gap-3">
        <span className="text-white/80 text-[8px] uppercase tracking-widest font-bold [writing-mode:vertical-rl] rotate-180">Reklam Alanı</span>
        <div className="w-6 h-px bg-white/30" />
        <p className="text-white/50 text-[7px] leading-tight">
          Destek olmak için iletişime geçin
        </p>
        <span className="px-2 py-1 bg-white/15 text-white text-[7px] font-medium rounded hover:bg-white/25 transition-colors">
          İletişim
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
      {ad.imageUrl ? (
        <div className="w-[80px] rounded-lg overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={80} height={400} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-[80px] h-[350px] bg-gradient-to-b from-primary-dark to-primary rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white text-[10px] font-bold text-center px-2 [writing-mode:vertical-rl] rotate-180">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return (
    <div className={`hidden xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-0" : "right-0"}`}>
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
