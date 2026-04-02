import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import AdSense from "@/components/shared/AdSense";
import PageTransition from "@/components/shared/PageTransition";
import InlineAdBanner from "@/components/shared/InlineAdBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAnalytics />
      <AdSense />
      <Header />
      <InlineAdBanner />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
