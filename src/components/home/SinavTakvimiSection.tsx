"use client";

import { CalendarDays, Clock, ExternalLink } from "lucide-react";
import type { SinavTakvimi } from "@/types";

interface SinavTakvimiSectionProps {
  items: SinavTakvimi[];
  loading?: boolean;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function daysLeft(dateStr: string) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  return diff;
}

export default function SinavTakvimiSection({ items, loading }: SinavTakvimiSectionProps) {
  if (loading) {
    return (
      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="bg-primary text-white px-4 py-2.5 flex items-center gap-2">
          <CalendarDays size={18} />
          <h3 className="font-bold text-xs uppercase tracking-wide">Sınav Takvimi</h3>
        </div>
        <div className="divide-y divide-border">
          {[1, 2].map((i) => (
            <div key={i} className="px-3 py-2.5 animate-pulse">
              <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1.5" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-primary text-white px-4 py-2.5 flex items-center gap-2">
        <CalendarDays size={18} />
        <h3 className="font-bold text-xs uppercase tracking-wide">Sınav Takvimi</h3>
      </div>

      <ul className="divide-y divide-border">
        {items.slice(0, 2).map((item) => {
          const days = daysLeft(item.examDate);
          return (
            <li key={item.id}>
              <a
                href={item.sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 px-3 py-2.5 hover:bg-primary-50 transition-colors group"
              >
                <div className="flex flex-col items-center min-w-[44px] mt-0.5">
                  <span className="text-lg font-bold text-primary leading-none">
                    {new Date(item.examDate).getDate()}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase">
                    {new Date(item.examDate).toLocaleDateString("tr-TR", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {days !== null && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${days <= 7 ? "bg-red-100 text-red-600" : days <= 30 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        <Clock size={9} className="inline mr-0.5 -mt-px" />
                        {days} gün
                      </span>
                    )}
                    {item.applicationDeadline && (
                      <span className="text-[10px] text-gray-400">
                        Son başvuru: {formatDate(item.applicationDeadline)}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink size={12} className="mt-1 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
