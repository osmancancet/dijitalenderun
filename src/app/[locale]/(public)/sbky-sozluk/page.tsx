"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import PageTitle from "@/components/shared/PageTitle";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Search, BookOpen, ChevronDown, ChevronUp, X } from "lucide-react";
import type { SozlukItem } from "@/types";

export default function SbkySozlukPage() {
  const [items, setItems] = useState<SozlukItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/sozluk")
      .then((res) => res.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeItems = items.filter((i) => i.isActive);
  const categories = useMemo(
    () => [...new Set(activeItems.map((i) => i.category).filter(Boolean))],
    [activeItems]
  );

  const filtered = useMemo(() => {
    let result = activeItems;
    if (activeCategory) {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.term.toLowerCase().includes(q) || i.definition.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeItems, activeCategory, search]);

  const grouped = useMemo(() => {
    const map: Record<string, SozlukItem[]> = {};
    for (const item of filtered) {
      const letter = item.term.charAt(0).toLocaleUpperCase("tr");
      if (!map[letter]) map[letter] = [];
      map[letter].push(item);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b, "tr"));
  }, [filtered]);

  const allLetters = useMemo(() => grouped.map(([l]) => l), [grouped]);

  function scrollToLetter(letter: string) {
    setActiveLetter(letter);
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle
        title="SBKY Sözlük"
        subtitle="Siyaset Bilimi ve Kamu Yönetimi terimleri sözlüğü"
      />

      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <span><strong className="text-foreground">{activeItems.length}</strong> terim</span>
        </div>
        {categories.length > 0 && (
          <div>
            <strong className="text-foreground">{categories.length}</strong> kategori
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Terim veya tanım ara..."
          className="w-full pl-11 pr-10 py-3 border border-border rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
              !activeCategory
                ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                : "bg-white border border-border text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat!)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                  : "bg-white border border-border text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Alphabet navigation */}
      {allLetters.length > 3 && !search && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {allLetters.map((letter) => (
            <button
              key={letter}
              onClick={() => scrollToLetter(letter)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeLetter === letter
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-border text-gray-500 hover:bg-primary hover:text-white hover:border-primary hover:scale-110"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState description={search ? "Aramanızla eşleşen terim bulunamadı." : "Henüz sözlük terimi eklenmemiş."} />
      ) : (
        <div className="space-y-8">
          {grouped.map(([letter, terms], groupIndex) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-24" style={{ animationDelay: `${groupIndex * 50}ms` }}>
              {/* Letter header */}
              <div className="flex items-center gap-3 mb-4 sticky top-16 z-10 bg-muted/80 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
                <span className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                <span className="text-xs text-gray-400 font-medium">{terms.length} terim</span>
              </div>

              {/* Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {terms.map((item, i) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className={`group bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                        isExpanded
                          ? "border-primary shadow-lg shadow-primary/10 md:col-span-2"
                          : "border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold transition-colors duration-200 ${
                              isExpanded ? "text-primary text-lg" : "text-foreground group-hover:text-primary"
                            }`}>
                              {item.term}
                            </h3>
                            {item.category && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className={`text-gray-500 mt-2 leading-relaxed transition-all duration-300 ${
                            isExpanded ? "text-gray-600" : "line-clamp-2 text-sm"
                          }`}>
                            {item.definition}
                          </p>
                        </div>
                        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isExpanded ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search results count */}
      {search && filtered.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          &ldquo;{search}&rdquo; için <strong>{filtered.length}</strong> sonuç bulundu
        </div>
      )}
    </div>
  );
}
