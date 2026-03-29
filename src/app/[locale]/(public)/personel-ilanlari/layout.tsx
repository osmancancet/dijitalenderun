import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personel İlanları",
  description: "Güncel kamu personeli alım ilanları, başvuru tarihleri ve detaylar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
