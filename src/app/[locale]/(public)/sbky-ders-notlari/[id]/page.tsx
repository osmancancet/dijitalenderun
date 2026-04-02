"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowLeft, Download, BookOpen, FileText } from "lucide-react";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import RelatedNotes from "@/components/content/RelatedNotes";
import type { DersNotu } from "@/types";

export default function SbkyDersNotuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<DersNotu | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<DersNotu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true); setError(false);
    fetch(`/api/public/ders-notlari/${id}?type=sbky`)
      .then((res) => res.json())
      .then((d) => {
        setNote(d.note ?? null);
        setRelatedNotes(d.relatedNotes ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!note) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-gray-300" />
        </div>
        <p className="text-gray-500 text-lg">Ders notu bulunamadı.</p>
        <Link href="/sbky-ders-notlari" className="inline-flex items-center gap-2 text-primary hover:underline mt-4">
          <ArrowLeft size={16} /> Geri Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link
        href="/sbky-ders-notlari"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        SBKY Ders Notlarına Dön
      </Link>

      <PageTitle title={note.title} subtitle={note.category} />

      {note.description && (
        <p className="text-gray-500 mb-6 text-lg leading-relaxed">{note.description}</p>
      )}

      {note.fileUrl && (
        <div className="mb-8">
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
          >
            <Download size={20} className="group-hover:animate-bounce" />
            <span>Dosyayı İndir</span>
            {note.fileSize ? <span className="text-white/70 text-sm">({Math.round(note.fileSize / 1024)} KB)</span> : null}
          </a>
        </div>
      )}

      {note.content && (
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <BookOpen size={18} className="text-primary" />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">İçerik</span>
          </div>
          <div className="text-gray-700 leading-relaxed text-[15px]">
            <RichTextRenderer content={note.content} />
          </div>
        </div>
      )}

      <RelatedNotes notes={relatedNotes} basePath="/sbky-ders-notlari" />
    </div>
  );
}
