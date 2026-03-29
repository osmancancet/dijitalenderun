import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SBKY Ders Notları",
  description: "Siyaset Bilimi ve Kamu Yönetimi ders notları, sınav hazırlık materyalleri ve güncel akademik kaynaklar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
