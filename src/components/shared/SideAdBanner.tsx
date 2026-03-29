"use client";

export default function SideAdBanner({ side }: { side: "left" | "right" }) {
  return (
    <div className={`hidden xl:flex fixed top-1/2 -translate-y-1/2 z-30 ${side === "left" ? "left-2" : "right-2"}`}>
      <a
        href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com&su=Reklam%20/%20İş%20Birliği"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="w-[120px] bg-gradient-to-b from-primary-dark to-primary rounded-lg p-3 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="text-white/80 text-[10px] uppercase tracking-wider font-semibold mb-2">Reklam Alanı</div>
          <div className="w-full h-px bg-white/20 mb-2" />
          <p className="text-white/60 text-[9px] leading-relaxed mb-3">
            Bu alanda reklam vererek platformumuza destek olabilirsiniz.
          </p>
          <span className="inline-block px-2.5 py-1 bg-white/15 text-white text-[9px] font-medium rounded group-hover:bg-white/25 transition-colors">
            İletişime Geçin
          </span>
        </div>
      </a>
    </div>
  );
}
