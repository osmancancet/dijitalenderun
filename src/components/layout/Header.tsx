"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/sbky-ders-notlari" as const, label: t("sbky") },
    { href: "/mevzuat-ders-notlari" as const, label: t("mevzuat") },
    { href: "/dr-ozan-yetkin" as const, label: t("drOzan") },
    { href: "/blog" as const, label: t("blog") },
    { href: "/hakkimizda" as const, label: t("about") },
    { href: "/iletisim" as const, label: t("contact") },
  ];

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo-beyaz.png"
              alt="Dijital Enderun"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Toggle + Language */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Menü"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/20 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
