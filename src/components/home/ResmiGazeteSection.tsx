"use client";

import { useState } from "react";
import { Newspaper, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ResmiGazeteItem } from "@/types";

interface ResmiGazeteSectionProps {
  items: ResmiGazeteItem[];
  loading?: boolean;
}

export default function ResmiGazeteSection({ items, loading }: ResmiGazeteSectionProps) {
  const t = useTranslations("home");
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(items.length / perPage);
  const visible = items.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={18} />
          <h3 className="font-bold text-xs uppercase tracking-wide">{t("resmiGazete")}</h3>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-0.5 rounded hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] font-medium min-w-[28px] text-center">
              {page + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-0.5 rounded hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Items */}
      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2].map((i) => (
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
          {visible.map((item) => (
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
