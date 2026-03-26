"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { PersonelIlani } from "@/types";
import { ExternalLink, Link2 } from "lucide-react";
import Image from "next/image";
import PageTitle from "@/components/shared/PageTitle";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function PersonelIlanlariPage() {
  const t = useTranslations("personelIlanlari");
  const home = useTranslations("home");
  const [allItems, setAllItems] = useState<PersonelIlani[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/personel-ilanlari")
      .then((res) => res.json())
      .then((d) => setAllItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = allItems.filter((i) => i.isActive);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} />

      {items.length === 0 ? (
        <EmptyState description={t("empty")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <div className="absolute top-4 right-4 w-24 h-24 border-2 border-gray-800 rotate-12" />
                <div className="absolute top-12 right-12 w-16 h-16 border-2 border-gray-800 -rotate-6" />
                <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-gray-800 rotate-45" />
              </div>

              <div className="absolute top-3 right-3 w-12 h-12 opacity-60">
                <Image src="/images/logo-renkli.png" alt="Dijital Enderun" width={48} height={48} className="object-contain" />
              </div>

              <div className="bg-primary-dark text-white px-4 py-2.5">
                <h4 className="text-sm font-bold uppercase tracking-wider">{home("jobPostingBanner")}</h4>
              </div>

              <div className="px-4 py-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-5 bg-primary-dark rounded-full mt-0.5 shrink-0" />
                  <p className="text-sm font-bold text-foreground leading-tight">{item.institution}</p>
                </div>

                {item.gazeteTarihi && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-5 bg-primary-dark rounded-full mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600">{item.gazeteTarihi} {home("gazeteDateSuffix")}</p>
                  </div>
                )}

                {item.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 italic">
                    {item.description}
                  </p>
                )}
              </div>

              {item.sourceUrl && (
                <div className="px-4 pb-4">
                  <p className="text-[10px] text-gray-400 mb-1.5">
                    {home("jobLinkHint")}
                  </p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-md text-xs font-medium text-primary hover:bg-primary-50 transition-colors shadow-sm"
                  >
                    <Link2 size={12} />
                    resmigazete.gov.tr
                    <ExternalLink size={10} className="text-gray-400" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
