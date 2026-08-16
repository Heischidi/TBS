import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { MobileBottomNav } from "@/components/shop/MobileBottomNav";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
