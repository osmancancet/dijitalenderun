"use client";

import { Newspaper, ExternalLink, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ResmiGazeteItem } from "@/types";

interface ResmiGazeteSectionProps {
  items: ResmiGazeteItem[];
  loading?: boolean;
}

export default function ResmiGazeteSection({ items, loading }: ResmiGazeteSectionProps) {
  const t = useTranslations("home");

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-2.5 flex items-center gap-2">
        <Newspaper size={18} />
        <h3 className="font-bold text-xs uppercase tracking-wide">{t("resmiGazete")}</h3>
      </div>

      {/* Items */}
      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-3 py-2.5 animate-pulse">
              <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1.5" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-gray-400">
          {t("kaynakBelirtilmemis")}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.slice(0, 4).map((item) => (
            <li key={item.id}>
              <a
                href={item.sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 px-3 py-2.5 hover:bg-primary-50 transition-colors group"
              >
                <ChevronRight size={14} className="mt-0.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                    {item.summary}
                  </p>
                </div>
                <ExternalLink size={12} className="mt-1 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      {items.length > 0 && (
        <Link href="/resmi-gazete" className="block border-t border-border px-3 py-2 text-right hover:bg-primary-50 transition-colors">
          <span className="text-[11px] text-primary font-medium">
            {t("tumunuGor")} →
          </span>
        </Link>
      )}
    </div>
  );
}
