import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr. Öğr. Üyesi Ozan Yetkin",
  description: "Dr. Öğr. Üyesi Ozan Yetkin akademik profil, yayınlar, eğitim ve araştırma alanları.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
