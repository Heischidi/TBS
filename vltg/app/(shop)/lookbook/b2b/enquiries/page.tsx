import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { B2BEnquiryForm } from "@/components/shop/B2BEnquiryForm";

export const metadata: Metadata = {
  title: "Enquiries for B2B | TBS",
  description:
    "Interested in stocking, wholesale or collaborating with TBS? Drop your request and our team will get back to you by email.",
};

export default function B2BEnquiriesPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="site-container pt-12">
        <Link
          href="/lookbook?category=b2b"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-[11px] uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} />
          Lookbook / B2B
        </Link>

        <div className="max-w-2xl">
          <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
            Partnerships &amp; Wholesale
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide">
            ENQUIRIES FOR B2B
          </h1>
          <p className="text-text-secondary text-sm mt-4 mb-10 leading-relaxed">
            Looking to stock TBS, collaborate, or place a wholesale order? Drop your request below and our team
            will get back to you by email.
          </p>

          <B2BEnquiryForm />
        </div>
      </div>
    </div>
  );
}

