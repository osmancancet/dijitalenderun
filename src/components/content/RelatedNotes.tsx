"use client";

import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";
import type { DersNotu } from "@/types";

interface RelatedNotesProps {
  notes: DersNotu[];
  basePath: string;
}

export default function RelatedNotes({ notes, basePath }: RelatedNotesProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Benzer Notlar
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`${basePath}/${note.id}`}
            className="block bg-white dark:bg-gray-900 border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
          >
            <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {note.title}
            </h3>
            {note.category && (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {note.category}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
