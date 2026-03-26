import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

export function formatDate(date: Timestamp | Date | string): string {
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return format(d, "d MMMM yyyy", { locale: tr });
}

export function formatShortDate(date: Timestamp | Date | string): string {
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return format(d, "dd.MM.yyyy", { locale: tr });
}

export function formatRelative(date: Timestamp | Date | string): string {
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: tr });
}
