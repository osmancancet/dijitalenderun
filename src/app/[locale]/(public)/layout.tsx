import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import AdSense from "@/components/shared/AdSense";
import SideAdBanner from "@/components/shared/SideAdBanner";

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
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
