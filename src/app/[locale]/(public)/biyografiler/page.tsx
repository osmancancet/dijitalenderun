"use client";

import { useState, useEffect } from "react";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Biyografi } from "@/types";

export default function BiyografilerPage() {
  const [items, setItems] = useState<Biyografi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/biyografiler")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title="Biyografiler" subtitle="Siyaset bilimi ve kamu yönetimi alanında önemli isimler" />

      {items.length === 0 ? (
        <EmptyState description="Henüz biyografi eklenmemiş." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/biyografiler/${item.slug}` as never}
              className="group bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all"
            >
              {item.photoUrl ? (
                <div className="relative aspect-square">
                  <Image src={item.photoUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 20vw" />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">{item.name.split(" ").map(w => w[0]).join("")}</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.name}</h3>
                {item.title && <p className="text-xs text-gray-500 truncate mt-0.5">{item.title}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
