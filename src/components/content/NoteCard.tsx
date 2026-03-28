import { FileText, Download, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { DersNotu } from "@/types";

interface NoteCardProps {
  note: DersNotu;
  basePath: string;
  index?: number;
}

export default function NoteCard({ note, basePath, index = 0 }: NoteCardProps) {
  const fileSizeKB = note.fileSize ? Math.round(note.fileSize / 1024) : 0;
  const hasFile = !!note.fileUrl;
  const hasContent = !!note.content;

  return (
    <div
      className="bg-white border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          {hasContent && !hasFile ? (
            <BookOpen size={22} className="text-primary" />
          ) : (
            <FileText size={22} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {note.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-semibold">
              {note.category}
            </span>
            {fileSizeKB > 0 && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{fileSizeKB} KB</span>
            )}
            {hasFile && (
              <span className="text-xs text-gray-400">
                {note.downloadCount} indirme
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {hasContent && (
            <Link
              href={`${basePath}/${note.id}` as never}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-sm"
              title="Oku"
            >
              <BookOpen size={16} />
            </Link>
          )}
          {hasFile && (
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-light hover:scale-110 transition-all duration-200 shadow-sm"
              title="İndir"
            >
              <Download size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
