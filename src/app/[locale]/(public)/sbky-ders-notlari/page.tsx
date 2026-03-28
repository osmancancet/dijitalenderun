"use client";

import { useState, useEffect, useMemo } from "react";
import PageTitle from "@/components/shared/PageTitle";
import NoteCard from "@/components/content/NoteCard";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Search, BookOpen, X } from "lucide-react";
import type { DersNotu } from "@/types";

export default function SbkyDersNotlariPage() {
  const [items, setItems] = useState<DersNotu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/ders-notlari?type=sbky")
      .then((res) => res.json())
      .then((d) => setItems(d.notes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const notes = items.filter((n) => n.isActive);
  const categories = useMemo(() => [...new Set(notes.map((n) => n.category))], [notes]);

  const filtered = useMemo(() => {
    let result = notes;
    if (activeCategory) result = result.filter((n) => n.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return result;
  }, [notes, activeCategory, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle
        title="SBKY Ders Notları"
        subtitle="Siyaset Bilimi ve Kamu Yönetimi ders notlarına erişin"
      />

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <span><strong className="text-foreground">{notes.length}</strong> ders notu</span>
        </div>
        {categories.length > 0 && (
          <span><strong className="text-foreground">{categories.length}</strong> kategori</span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ders notu ara..."
          className="w-full pl-11 pr-10 py-3 border border-border rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
              !activeCategory
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "bg-white border border-border text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            Tümü ({notes.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-white border border-border text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <EmptyState description={search ? "Aramanızla eşleşen not bulunamadı." : "Henüz ders notu eklenmemiş."} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note, i) => (
            <NoteCard key={note.id} note={note} basePath="/sbky-ders-notlari" index={i} />
          ))}
        </div>
      )}

      {search && filtered.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">
          &ldquo;{search}&rdquo; için <strong>{filtered.length}</strong> sonuç
        </p>
      )}
    </div>
  );
}
