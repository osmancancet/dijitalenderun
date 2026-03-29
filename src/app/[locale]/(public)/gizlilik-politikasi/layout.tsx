import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası & KVKK",
  description: "Dijital Enderun gizlilik politikası, kişisel verilerin korunması ve kullanım koşulları.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
