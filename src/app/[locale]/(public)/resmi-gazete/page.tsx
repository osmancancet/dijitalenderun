"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { ResmiGazeteItem } from "@/types";
import { Newspaper, ExternalLink, Calendar, RefreshCw, FileText } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface GazeteFihristItem {
  title: string;
  summary: string;
  sourceUrl: string;
  date: string;
}

export default function ResmiGazetePage() {
  const t = useTranslations("resmiGazete");
  const [allItems, setAllItems] = useState<ResmiGazeteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/resmi-gazete")
      .then((res) => res.json())
      .then((d) => setAllItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [dailyItems, setDailyItems] = useState<GazeteFihristItem[]>([]);
  const [dailyDate, setDailyDate] = useState("");
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
    async function fetchDaily() {
      try {
        const res = await fetch("/api/resmi-gazete");
        const data = await res.json();
        if (res.ok) {
          setDailyItems(data.allItems || data.items || []);
          setDailyDate(data.date || "");
        }
      } catch {
        // silently fail
      } finally {
        setDailyLoading(false);
      }
    }
    fetchDaily();
  }, []);

  const savedItems = allItems.filter((g) => g.isActive);

  // Kategoriye göre grupla (günlük gazete)
  const groupedDaily = dailyItems.reduce<Record<string, GazeteFihristItem[]>>((acc, item) => {
    const cat = item.summary || "Diğer";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading && dailyLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} />

      {/* Günün Gazetesi */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("dailyTitle")}</h2>
            {dailyDate && (
              <p className="text-sm text-gray-500">{dailyDate} {t("dailyDateSuffix")}</p>
            )}
          </div>
        </div>

        {dailyLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-16" />
            ))}
          </div>
        ) : dailyItems.length === 0 ? (
          <div className="bg-gray-50 border border-border rounded-lg px-6 py-8 text-center text-sm text-gray-400">
            {t("dailyEmpty")}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDaily).map(([category, items]) => (
              <div key={category} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary-dark/5 border-b border-border px-5 py-3">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-wide flex items-center gap-2">
                    <FileText size={14} />
                    {category}
                  </h3>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.sourceUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 px-5 py-3.5 hover:bg-primary-50/50 transition-colors group"
                      >
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Newspaper size={12} className="text-primary" />
                        </div>
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors leading-snug flex-1">
                          {item.title}
                        </p>
                        <ExternalLink size={14} className="mt-0.5 text-gray-300 shrink-0 group-hover:text-primary transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Kayıtlı İçerikler */}
      {savedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
              <RefreshCw size={20} className="text-white" />
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
