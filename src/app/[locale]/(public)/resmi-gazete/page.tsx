"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { ResmiGazeteItem } from "@/types";
import { Newspaper, ExternalLink } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ResmiGazetePage() {
  const t = useTranslations("resmiGazete");
  const [allItems, setAllItems] = useState<ResmiGazeteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function fetchData() {
    setLoading(true); setError(false);
    fetch("/api/public/resmi-gazete")
      .then((res) => res.json())
      .then((d) => setAllItems(d.items ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  const savedItems = allItems.filter((g) => g.isActive);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500 mb-4">Veriler yüklenirken bir hata oluştu.</p>
      <button onClick={fetchData} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-light">Tekrar Dene</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} />

      {/* Kayıtlar */}
      <section>
      </section>

      {/* Kayıtlı İçerikler */}
      {savedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
              <Newspaper size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t("savedTitle")}</h2>
              <p className="text-sm text-gray-500">{t("savedSubtitle")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {savedItems.map((item) => (
              <a
                key={item.id}
                href={item.sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-5 py-4 bg-white border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Newspaper size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.summary}
                  </p>
                </div>
                <ExternalLink size={16} className="mt-1 text-gray-300 shrink-0 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
