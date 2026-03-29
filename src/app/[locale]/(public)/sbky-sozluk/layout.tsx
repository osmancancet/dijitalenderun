import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SBKY Sözlük",
  description: "Siyaset bilimi ve kamu yönetimi terimler sözlüğü. Kavramlar, tanımlar ve açıklamalar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
