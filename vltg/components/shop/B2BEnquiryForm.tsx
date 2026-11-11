"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowRight, MailCheck } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  company: z.string().trim().min(2, "Please enter your company or brand"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)"),
  website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const inputClass = "w-full input-dark px-4 py-3 text-sm";
const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";
const errorClass = "text-red-400 text-xs mt-1";

export function B2BEnquiryForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/b2b-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(message);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-2 border border-white/5 p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-pink" />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink mb-6">
          <MailCheck size={32} />
        </div>
        <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-4">Enquiry Sent</h2>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          Thanks for reaching out. We&apos;ve received your request and will reply to you by email shortly.
        </p>
        <Link
          href="/lookbook?category=b2b"
          className="inline-flex items-center justify-center w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
        >
          Back to Lookbook
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-2 border border-white/5 p-6 md:p-8 relative overflow-hidden space-y-5"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-pink" />

      {serverError && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-sm uppercase tracking-wider"
        >
          {serverError}
        </div>
      )}

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="b2b-website">Leave this field empty</label>
        <input id="b2b-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="b2b-name">Full Name *</label>
          <input id="b2b-name" {...register("name")} className={inputClass} placeholder="John Doe" autoComplete="name" />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="b2b-company">Company / Brand *</label>
          <input id="b2b-company" {...register("company")} className={inputClass} placeholder="Your company" autoComplete="organization" />
          {errors.company && <p className={errorClass}>{errors.company.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="b2b-email">Email Address *</label>
        <input id="b2b-email" type="email" {...register("email")} className={inputClass} placeholder="john@company.com" autoComplete="email" />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="b2b-phone">Phone / WhatsApp</label>
          <input id="b2b-phone" {...register("phone")} className={inputClass} placeholder="+234 800 000 0000" autoComplete="tel" />
        </div>
        <div>
          <label className={labelClass} htmlFor="b2b-country">Country</label>
          <input id="b2b-country" {...register("country")} className={inputClass} placeholder="Nigeria" autoComplete="country-name" />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="b2b-message">Drop your request *</label>
        <textarea
          id="b2b-message"
          {...register("message")}
          rows={6}
          className={`${inputClass} resize-none leading-relaxed`}
          placeholder="Tell us what you're looking for — wholesale, stockist, collaboration, quantities, timelines…"
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Enquiry
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </motion.form>
  );
}

