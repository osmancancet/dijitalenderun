"use client";

import { Briefcase, ExternalLink, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { PersonelIlani } from "@/types";

interface PersonelIlanlariSectionProps {
  items: PersonelIlani[];
  loading?: boolean;
}

function IlanKarti({ item, t }: { item: PersonelIlani; t: (key: string) => string }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-3 right-3 w-20 h-20 border-2 border-gray-800 rotate-12" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-2 border-gray-800 rotate-45" />
      </div>

      <div className="absolute top-2.5 right-2.5 w-10 h-10 opacity-50">
        <Image src="/images/logo-renkli.png" alt="Dijital Enderun" width={40} height={40} className="object-contain" />
      </div>

      <div className="px-3 py-3 space-y-2">
        <div className="flex items-start gap-1.5">
          <div className="w-1 h-4 bg-primary-dark rounded-full mt-0.5 shrink-0" />
          <p className="text-xs font-bold text-foreground leading-tight">{item.institution}</p>
        </div>

        {item.gazeteTarihi && (
          <div className="flex items-start gap-1.5">
            <div className="w-1 h-4 bg-primary-dark rounded-full mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-600">{item.gazeteTarihi} {t("gazeteDateSuffix")}</p>
          </div>
        )}

        {item.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 italic">
            {item.description}
          </p>
        )}
      </div>

      {item.sourceUrl && (
        <div className="px-3 pb-2.5">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-dark text-white rounded text-[11px] font-medium hover:bg-primary transition-colors shadow-sm"
          >
            <Link2 size={10} />
            resmigazete.gov.tr
            <ExternalLink size={9} className="text-gray-400" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function PersonelIlanlariSection({ items, loading }: PersonelIlanlariSectionProps) {
  const t = useTranslations("home");

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-primary text-white px-4 py-2.5 flex items-center gap-2">
        <Briefcase size={18} />
        <h3 className="font-bold text-xs uppercase tracking-wide">{t("personelIlanlari")}</h3>
      </div>

      {loading ? (
        <div className="p-2.5">
          <div className="animate-pulse bg-gray-100 rounded-lg h-32" />
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-gray-400">
          {t("noJobPostings")}
        </div>
      ) : (
        <div className="p-2.5 space-y-2.5 max-h-[220px] overflow-y-auto">
          {items.slice(0, 2).map((item) => (
            <IlanKarti key={item.id} item={item} t={t} />
          ))}
        </div>
      )}

      {/* Footer */}
      {items.length > 0 && (
        <Link href="/personel-ilanlari" className="block border-t border-border px-3 py-2 text-right hover:bg-primary-50 transition-colors">
          <span className="text-[11px] text-primary font-medium">
            {t("tumunuGor")} →
          </span>
        </Link>
      )}
    </div>
  );
}
