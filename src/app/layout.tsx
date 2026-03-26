import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import CopyProtection from "@/components/shared/CopyProtection";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import AdSense from "@/components/shared/AdSense";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dijital Enderun",
    template: "%s | Dijital Enderun",
  },
  description: "Sağlık Bilimleri ve Kamu Yönetimi alanında güncel ders notları, mevzuat bilgileri, Resmi Gazete duyuruları ve personel ilanları. SBKY hazırlık kaynakları.",
  keywords: ["SBKY", "ders notları", "mevzuat", "sağlık yönetimi", "kamu yönetimi", "personel ilanları", "resmi gazete", "dijital enderun", "sağlık bilimleri"],
  authors: [{ name: "Dr. Ozan Yetkin" }],
  creator: "Dijital Enderun",
  publisher: "Dijital Enderun",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Dijital Enderun",
    title: "Dijital Enderun - SBKY Ders Notları ve Mevzuat",
    description: "Sağlık Bilimleri ve Kamu Yönetimi alanında güncel ders notları, mevzuat bilgileri ve kariyer fırsatları.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dijital Enderun",
    description: "SBKY Ders Notları, Mevzuat, Resmi Gazete ve Personel İlanları",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <AdSense />
        <CopyProtection />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
