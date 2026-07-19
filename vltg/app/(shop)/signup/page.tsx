"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowRight, MailCheck } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/signup-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to start registration");
      }

      setSuccess("We have sent a verification link to your email address. Please click it to complete registration.");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full input-dark px-4 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-2 border border-white/5 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-pink" />

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink mb-6">
                <MailCheck size={32} />
              </div>
              <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-4">
                Check Your Email
              </h1>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                {success}
              </p>
              <p className="text-xs text-text-muted mb-8">
                Make sure to check your spam folder if you don't receive it within a few minutes.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors gap-2"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center md:text-left">
                <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-2">
                  Create Account
                </h1>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  Join the collective. Verify your email to start shopping.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className={labelClass} htmlFor="signup-email">Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={inputClass}
                    placeholder="john@email.com"
                    id="signup-email"
                    autoComplete="email"
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  id="signup-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-text-muted">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-white hover:text-brand-pink transition-colors uppercase tracking-wider font-medium ml-1"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
