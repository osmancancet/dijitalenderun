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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
