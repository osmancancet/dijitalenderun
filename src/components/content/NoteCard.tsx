import { FileText, Download } from "lucide-react";
import type { DersNotu } from "@/types";

interface NoteCardProps {
  note: DersNotu;
}

export default function NoteCard({ note }: NoteCardProps) {
  const fileSizeKB = note.fileSize ? Math.round(note.fileSize / 1024) : 0;

  return (
    <div className="bg-white border border-border rounded-lg p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
          <FileText size={24} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {note.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {note.description}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs bg-primary-50 text-primary px-2 py-0.5 rounded-full font-medium">
              {note.category}
            </span>
            {fileSizeKB > 0 && (
              <span className="text-xs text-gray-400">{fileSizeKB} KB</span>
            )}
            <span className="text-xs text-gray-400">
              {note.downloadCount} indirme
            </span>
          </div>
        </div>
        <a
          href={note.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-light transition-colors shrink-0"
          title="İndir"
        >
          <Download size={18} />
        </a>
      </div>
    </div>
  );
}
