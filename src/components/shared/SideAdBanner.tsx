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

  // Reklam yoksa varsayılan "destek olun" göster
  const defaultBanner = (
    <a
      href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className="w-[100px] bg-gradient-to-b from-primary-dark to-primary rounded-lg p-2.5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
        <div className="text-white/80 text-[9px] uppercase tracking-wider font-semibold mb-1.5">Reklam</div>
        <div className="w-full h-px bg-white/20 mb-1.5" />
        <p className="text-white/50 text-[8px] leading-relaxed mb-2">
          Bu alanda reklam vererek destek olabilirsiniz.
        </p>
        <span className="inline-block px-2 py-0.5 bg-white/15 text-white text-[8px] font-medium rounded group-hover:bg-white/25 transition-colors">
          İletişim
        </span>
      </div>
    </a>
  );

  const adBanner = ad && (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
      {ad.imageUrl ? (
        <div className="w-[120px] rounded-lg overflow-hidden shadow-lg">
          <Image src={ad.imageUrl} alt={ad.title} width={120} height={400} className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-[120px] h-[300px] bg-gradient-to-b from-primary-dark to-primary rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold text-center px-2">{ad.title}</span>
        </div>
      )}
    </a>
  );

  return (
    <div className={`hidden xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-1" : "right-1"}`}>
      {ad ? adBanner : defaultBanner}
    </div>
  );
}
