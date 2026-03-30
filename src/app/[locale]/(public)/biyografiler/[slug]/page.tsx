"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { stripHtml } from "@/lib/stripHtml";
import type { Biyografi } from "@/types";
import { useParams } from "next/navigation";

export default function BiyografiDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<Biyografi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/biyografiler")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.items as Biyografi[])?.find((b) => b.slug === slug);
        setItem(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><LoadingSpinner /></div>;

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Biyografi bulunamadı.</p>
        <Link href="/biyografiler" className="text-primary text-sm mt-4 inline-block hover:underline">← Biyografilere Dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/biyografiler" className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline">
        <ArrowLeft size={16} /> Biyografilere Dön
      </Link>

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="md:flex">
          {item.photoUrl && (
            <div className="relative w-full md:w-64 h-64 md:h-auto shrink-0">
              <Image src={item.photoUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 256px" />
            </div>
          )}
          <div className="p-6 flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">{item.name}</h1>
            {item.title && <p className="text-sm text-gray-500 mb-4">{item.title}</p>}
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {stripHtml(item.bio)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
