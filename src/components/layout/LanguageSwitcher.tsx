"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, { label: string; flag: string }> = {
  tr: { label: "TR", flag: "🇹🇷" },
  en: { label: "EN", flag: "🇬🇧" },
  ar: { label: "AR", flag: "🇸🇦" },
  de: { label: "DE", flag: "🇩🇪" },
};

const locales: Locale[] = ["tr", "en", "ar", "de"];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors text-white"
        aria-label="Dil Seçimi"
      >
        <Globe size={16} />
        <span>{localeLabels[locale].flag} {localeLabels[locale].label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                loc === locale ? "bg-primary-50 text-primary font-semibold" : "text-gray-700"
              }`}
            >
              <span>{localeLabels[loc].flag}</span>
              <span>{localeLabels[loc].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
