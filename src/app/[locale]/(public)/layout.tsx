import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import AdSense from "@/components/shared/AdSense";
import SideAdBanner from "@/components/shared/SideAdBanner";
import PageTransition from "@/components/shared/PageTransition";

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
      <SideAdBanner side="left" />
      <SideAdBanner side="right" />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
