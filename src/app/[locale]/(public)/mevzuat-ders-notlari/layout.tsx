import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mevzuat Ders Notları",
  description: "Kamu yönetimi mevzuat ders notları, kanun ve yönetmelik özetleri, sınav hazırlık içerikleri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
