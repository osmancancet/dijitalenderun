"use client";

import { useState, useEffect } from "react";
import PageTitle from "@/components/shared/PageTitle";
import NoteCard from "@/components/content/NoteCard";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { DersNotu } from "@/types";

export default function SbkyDersNotlariPage() {
  const [items, setItems] = useState<DersNotu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/ders-notlari?type=sbky")
      .then((res) => res.json())
      .then((d) => setItems(d.notes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const notes = items.filter((n) => n.isActive);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(notes.map((n) => n.category))];
  const filtered = activeCategory ? notes.filter((n) => n.category === activeCategory) : notes;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle
        title="SBKY Ders Notları"
        subtitle="Siyaset Bilimi ve Kamu Yönetimi ders notlarına erişin"
      />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
              !activeCategory ? "bg-primary text-white" : "bg-primary-50 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                activeCategory === cat ? "bg-primary text-white" : "bg-primary-50 text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState description="Henüz ders notu eklenmemiş." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
