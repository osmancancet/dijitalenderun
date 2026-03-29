import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Dijital Enderun hakkında bilgi. Misyon, vizyon ve platformun amacı.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
