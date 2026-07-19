import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AnnouncementBar } from "@/components/shop/AnnouncementBar";

export const metadata: Metadata = {
  title: {
    default: "TBS — Premium Fashion Store",
    template: "%s | TBS",
  },
  description:
    "TBS is a premium fashion brand offering bold streetwear, limited drops, and exclusive collections. Free shipping on orders over ₦50,000.",
  keywords: ["streetwear", "fashion", "premium", "limited edition", "TBS", "Nigeria fashion", "online store"],
  authors: [{ name: "TBS" }],
  creator: "TBS",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "TBS",
    title: "TBS — Premium Fashion Store",
    description: "Bold. Limited. Premium fashion for those who move culture forward. Shop new arrivals, flash sales & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <Providers>
          {/* Global announcement bar — sits above navbar */}
          <AnnouncementBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
