"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, Scale, BookMarked } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title?: string;
  term?: string;
  category?: string;
  type: "sbky" | "mevzuat" | "sozluk";
  url: string;
}

const typeLabels = {
  sbky: { label: "SBKY Ders Notu", icon: BookOpen, color: "text-blue-600" },
  mevzuat: { label: "Mevzuat Notu", icon: Scale, color: "text-purple-600" },
  sozluk: { label: "Sözlük", icon: BookMarked, color: "text-green-600" },
};

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/public/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.results || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(url: string) {
    onClose();
    router.push(url);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ders notu, kavram veya konu ara..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Aranıyor...</div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Sonuç bulunamadı.</div>
          )}
          {results.map((r) => {
            const meta = typeLabels[r.type];
            const Icon = meta.icon;
            return (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => handleSelect(r.url)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <Icon size={18} className={`${meta.color} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title || r.term}</p>
                  <p className="text-xs text-gray-400">{meta.label}{r.category ? ` · ${r.category}` : ""}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="px-4 py-2 border-t border-border bg-muted">
          <p className="text-[11px] text-gray-400">En az 2 karakter yazın · Ders notları ve sözlükte arar</p>
        </div>
      </div>
    </div>
  );
}
