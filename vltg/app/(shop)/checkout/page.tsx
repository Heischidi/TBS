"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Phone number required"),
  address: z.string().min(5, "Full address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  country: z.string().min(2, "Country required"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River",
  "Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano",
  "Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun",
  "Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
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

  const inputClass = "w-full input-dark px-4 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-white mb-10"
        >
          CHECKOUT
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-surface-2 border border-white/5 p-6">
                <h2 className="font-display text-xl tracking-wider mb-6">PERSONAL INFORMATION</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input {...register("name")} className={inputClass} placeholder="John Doe" id="checkout-name" />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input {...register("phone")} className={inputClass} placeholder="+234 800 000 0000" id="checkout-phone" />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Email Address *</label>
                    <input {...register("email")} type="email" className={inputClass} placeholder="john@email.com" id="checkout-email" />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-surface-2 border border-white/5 p-6">
                <h2 className="font-display text-xl tracking-wider mb-6">SHIPPING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Street Address *</label>
                    <input {...register("address")} className={inputClass} placeholder="12 Allen Avenue, Ikeja" id="checkout-address" />
                    {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input {...register("city")} className={inputClass} placeholder="Lagos" id="checkout-city" />
                    {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <select {...register("state")} className={`${inputClass} cursor-pointer`} id="checkout-state">
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Country *</label>
                    <input {...register("country")} className={inputClass} id="checkout-country" />
                    {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Order Notes (optional)</label>
                    <textarea {...register("notes")} className={`${inputClass} h-24 resize-none`} placeholder="Any special instructions..." id="checkout-notes" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-2 border border-white/5 p-6 sticky top-24">
                <h2 className="font-display text-xl tracking-wider mb-6">ORDER SUMMARY</h2>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-18 shrink-0 bg-surface-3 overflow-hidden">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-medium text-sm text-white line-clamp-1">{item.name}</p>
                        <p className="text-text-muted mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
                        <p className="text-brand-pink mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 mt-6 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span><span>{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span><span>TBD</span>
                  </div>
                </div>
                <div className="border-t border-white/5 mt-4 pt-4 flex justify-between">
                  <span className="font-medium uppercase tracking-wider">Total</span>
                  <span className="font-display text-2xl">{formatPrice(totalPrice())}</span>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-6 p-4 bg-brand-green/10 border border-brand-green/20 rounded-sm mb-6">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      After placing your order, you&apos;ll be redirected to WhatsApp to confirm your order with us directly.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-pink text-white py-4 font-medium uppercase tracking-widest text-sm hover:bg-brand-pink/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  id="place-order-btn"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <><MessageSquare size={16} /> Place Order via WhatsApp</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
