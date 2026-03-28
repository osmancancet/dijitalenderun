import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "İçerik bulunamadı",
  description = "Henüz bu bölümde içerik eklenmemiş.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
        <Inbox size={36} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-sm text-gray-400 mt-1.5 max-w-sm">{description}</p>
    </div>
  );
}
