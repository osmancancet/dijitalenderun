import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return format(d, "d MMMM yyyy", { locale: tr });
}

export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return format(d, "dd.MM.yyyy", { locale: tr });
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: tr });
}
