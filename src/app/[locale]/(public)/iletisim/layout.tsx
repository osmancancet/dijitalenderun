import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Dijital Enderun ile iletişime geçin. E-posta ve iletişim formu.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
