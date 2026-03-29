import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biyografiler",
  description: "Siyaset bilimi ve kamu yönetimi alanındaki önemli isimlerin biyografileri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
