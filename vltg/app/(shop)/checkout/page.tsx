"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Phone number required"),
  address: z.string().min(5, "Full address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  country: z.string().min(2, "Country required"),
  notes: z.string().optional(),
  whatsappConsent: z.boolean().refine(val => val === true, "You must agree to be contacted on WhatsApp"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "Nigeria" },
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        country: "Nigeria",
        address: "",
        city: "",
        state: "",
      });
    }
  }, [session, reset]);

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items: orderItems }),
      });

      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();

      // Build WhatsApp message
      const message = buildWhatsAppMessage({
        orderNumber: order.orderNumber,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        items: items.map((item) => ({
          productName: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice(),
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      });

      clearCart();

      // Redirect to WhatsApp
      const waUrl = buildWhatsAppUrl(message);
      window.location.href = waUrl;

    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const inputClass = "w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20";
  const labelClass = "block text-[10px] font-medium uppercase tracking-widest text-text-secondary mb-3";
  const errorClass = "text-red-400 text-[10px] mt-1 tracking-wide";

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#050505]">
      <div className="max-w-350 mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Stepper */}
        <div className="flex items-center gap-4 text-[10px] font-medium tracking-[0.2em] text-text-secondary uppercase mb-16 pt-8">
          <Link href="/cart" className="hover:text-white transition-colors">01 BAG</Link>
          <span className="w-6 h-px bg-white/20"></span>
          <span className="text-white">02 DETAILS</span>
          <span className="w-6 h-px bg-white/20"></span>
          <span className="opacity-50">03 CONFIRMATION</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column - Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              
              {/* Title Section */}
              <div className="mb-16">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-4">Secure Checkout</p>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 text-white">
                  Almost <span className="font-serif italic text-white/90">yours.</span>
                </h1>
                <p className="text-text-secondary text-sm max-w-md leading-relaxed">
                  A few details and your order goes straight to our team for confirmation on WhatsApp.
                </p>
              </div>

              {/* Form Sections */}
              <div className="space-y-0">
                {/* 01 CONTACT */}
                <div className="border-t border-white/10 py-10 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 shrink-0">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-white font-medium flex items-center">
                      <span className="italic font-serif text-lg mr-4 text-white/40 leading-none">01</span> CONTACT
                    </h2>
                  </div>
                  <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="md:col-span-1">
                      <label className={labelClass}>Full Name</label>
                      <input {...register("name")} className={inputClass} placeholder="John Doe" />
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelClass}>Phone Number</label>
                      <input {...register("phone")} className={inputClass} placeholder="+234 800 000 0000" />
                      {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Email Address</label>
                      <input {...register("email")} type="email" className={inputClass} placeholder="john@email.com" />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 02 SHIPPING */}
                <div className="border-t border-white/10 py-10 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 shrink-0">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-white font-medium flex items-center">
                      <span className="italic font-serif text-lg mr-4 text-white/40 leading-none">02</span> SHIPPING
                    </h2>
                  </div>
                  <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Street Address</label>
                      <input {...register("address")} className={inputClass} placeholder="12 Allen Avenue, Ikeja" />
                      {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelClass}>City</label>
                      <input {...register("city")} className={inputClass} placeholder="Lagos" />
                      {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelClass}>State</label>
                      <input {...register("state")} className={inputClass} placeholder="Lagos" />
                      {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Country</label>
                      <input {...register("country")} className={inputClass} placeholder="Nigeria" />
                      {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 03 ORDER NOTES */}
                <div className="border-t border-b border-white/10 py-10 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 shrink-0">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-white font-medium flex items-center">
                      <span className="italic font-serif text-lg mr-4 text-white/40 leading-none">03</span> ORDER NOTES
                    </h2>
                  </div>
                  <div className="md:w-3/4">
                    <label className={labelClass}>Anything we should know? (Optional)</label>
                    <input {...register("notes")} className={inputClass} placeholder="Special instructions, delivery requests..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 sticky top-24 shadow-2xl">
                <div className="flex justify-between items-baseline mb-8">
                  <h2 className="font-serif text-2xl text-white">Order summary</h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                    {items.length} ITEM{items.length !== 1 && 'S'}
                  </span>
                </div>
                
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-5">
                      <div className="relative w-16 h-20 bg-surface-2 overflow-hidden shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-[13px] text-white leading-snug">{item.name}</p>
                          <p className="text-[13px] font-medium text-white">{formatPrice(item.price)}</p>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{item.color} · Size {item.size}</p>
                        
                        {/* Quantity Selector Style */}
                        <div className="mt-3 flex items-center gap-4 border border-white/10 rounded-full px-3 py-1 w-fit">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-white/40 hover:text-white transition-colors text-xs"
                          >
                            —
                          </button>
                          <span className="text-xs font-medium w-3 text-center">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/40 hover:text-white transition-colors text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 py-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-white">{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="text-[11px] text-text-secondary">Confirmed on WhatsApp</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 pb-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-text-secondary mb-1">Total</span>
                  <span className="font-serif text-3xl md:text-4xl text-white">{formatPrice(totalPrice())}</span>
                </div>

                <div className="bg-[#111111] rounded-lg p-4 mb-6 flex items-start gap-3 border border-white/5">
                  <MessageSquare size={16} className="text-text-secondary mt-0.5 shrink-0" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    After placing your order, you'll be redirected to WhatsApp to confirm directly with our team.
                  </p>
                </div>

                <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input type="checkbox" {...register("whatsappConsent")} className="peer sr-only" />
                    <div className="w-4.5 h-4.5 border border-white/20 rounded-sm peer-checked:bg-white peer-checked:border-white transition-colors"></div>
                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary group-hover:text-white transition-colors leading-tight">
                      I agree to be contacted on WhatsApp about this order
                    </span>
                    {errors.whatsappConsent && <p className="text-red-400 text-[10px] mt-1">{errors.whatsappConsent.message}</p>}
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white text-black py-4 rounded-full font-semibold text-[11px] tracking-[0.15em] uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Place order via WhatsApp'}
                  {!submitting && <ArrowRight size={14} />}
                </button>

                <p className="text-center text-[9px] tracking-[0.2em] text-text-secondary uppercase mt-8">
                  Secure Checkout · TBS Lagos
                </p>
              </div>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}

