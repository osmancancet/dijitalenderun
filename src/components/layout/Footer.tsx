"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://x.com/dijitalenderun", icon: TwitterIcon, label: "X (Twitter)" },
  { href: "https://www.instagram.com/dijitalenderun/", icon: InstagramIcon, label: "Instagram" },
  { href: "https://www.youtube.com/@dijitalenderun/", icon: YouTubeIcon, label: "YouTube" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-primary-dark text-white mt-auto">
      {/* Üst Bölüm — Brand */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <div className="flex items-center gap-3 mb-8">
          <Image src="/images/logo-beyaz.png" alt="Dijital Enderun" width={180} height={40} className="h-9 w-auto" />
          <div>
            <p className="text-xs text-white/50">Siyaset Bilimi & Kamu Yönetimi</p>
          </div>
        </div>
      </div>

      {/* Ana Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {t("about")}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("aboutText")}
            </p>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/sbky-ders-notlari" className="text-white/60 hover:text-white transition-colors">
                  {nav("sbky")}
                </Link>
              </li>
              <li>
                <Link href="/mevzuat-ders-notlari" className="text-white/60 hover:text-white transition-colors">
                  {nav("mevzuat")}
                </Link>
              </li>
              <li>
                <Link href="/dr-ozan-yetkin" className="text-white/60 hover:text-white transition-colors">
                  {nav("drOzan")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
                  {nav("blog")}
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-white/60 hover:text-white transition-colors">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-white/60 hover:text-white transition-colors">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {t("contactInfo")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-white/40 text-xs mb-1">{t("generalEmail")}</p>
                <a
                  href="mailto:iletisim.dijitalenderun@gmail.com"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Mail size={14} className="shrink-0" />
                  <span>iletisim.dijitalenderun@gmail.com</span>
                </a>
              </li>
              <li>
                <p className="text-white/40 text-xs mb-1">{t("academicEmail")}</p>
                <a
                  href="mailto:ozan.yetkin@dpu.edu.tr"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Mail size={14} className="shrink-0" />
                  <span>ozan.yetkin@dpu.edu.tr</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {t("socialMedia")}
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-3">@dijitalenderun</p>
          </div>
        </div>
      </div>

      {/* Alt Çizgi — Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Dijital Enderun. {t("rights")}
          </p>
          <p className="text-xs text-white/30">
            Siyaset Bilimi ve Kamu Yönetimi Dijital Platformu
          </p>
        </div>
      </div>
    </footer>
  );
}
