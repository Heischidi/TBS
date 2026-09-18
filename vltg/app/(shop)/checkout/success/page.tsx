import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen pt-44 pb-24 bg-[#050505] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <CheckCircle2 size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-white">
          Order <span className="font-serif italic text-white/90">confirmed.</span>
        </h1>
        
        <p className="text-text-secondary text-sm leading-relaxed mb-10">
          Thank you for your purchase. We are processing your payment and preparing your order for shipment. A receipt has been sent to your email.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/profile/orders"
            className="w-full bg-white text-black py-4 rounded-full font-semibold text-[11px] tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
          >
            View My Orders
          </Link>
          <Link 
            href="/"
            className="w-full bg-transparent text-white border border-white/20 py-4 rounded-full font-semibold text-[11px] tracking-[0.15em] uppercase hover:bg-white/5 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
