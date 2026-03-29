import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  title: {
    default: "Dijital Enderun",
    template: "%s | Dijital Enderun",
  },
  description: "Siyaset Bilimi ve Kamu Yönetimi alanında güncel ders notları, mevzuat bilgileri, Resmi Gazete duyuruları ve personel ilanları.",
  keywords: ["siyaset bilimi", "kamu yönetimi", "ders notları", "mevzuat", "personel ilanları", "resmi gazete", "dijital enderun", "SBKY"],
  authors: [{ name: "Dr. Ozan Yetkin" }],
  creator: "Dijital Enderun",
  publisher: "Dijital Enderun",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Dijital Enderun",
    title: "Dijital Enderun - Siyaset Bilimi ve Kamu Yönetimi Platformu",
    description: "Siyaset Bilimi ve Kamu Yönetimi alanında güncel ders notları, mevzuat bilgileri ve kariyer fırsatları.",
    images: [{ url: "/images/logo-renkli.png", width: 1200, height: 630, alt: "Dijital Enderun" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dijital Enderun",
    description: "Ders Notları, Mevzuat, Resmi Gazete ve Personel İlanları",
    images: ["/images/logo-renkli.png"],
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
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Dijital Enderun",
              url: "https://dijitalenderun.org",
              logo: "https://dijitalenderun.org/images/logo-renkli.png",
              description: "Siyaset Bilimi ve Kamu Yönetimi alanında dijital eğitim platformu",
              founder: { "@type": "Person", name: "Dr. Ozan Yetkin" },
              sameAs: [
                "https://x.com/dijitalenderun",
                "https://www.instagram.com/dijitalenderun/",
                "https://www.youtube.com/@dijitalenderun/"
              ],
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
