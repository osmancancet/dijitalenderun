import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resmi Gazete",
  description: "Güncel Resmi Gazete duyuruları, mevzuat değişiklikleri ve yönetmelikler.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
