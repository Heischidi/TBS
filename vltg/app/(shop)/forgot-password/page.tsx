"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowRight, KeyRound } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to process request");
      }

      setSuccess("If that email is registered in our system, you will receive a link to reset your password shortly.");
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
                <KeyRound size={32} />
              </div>
              <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-4">
                Check Your Email
              </h1>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                {success}
              </p>
              <p className="text-xs text-text-muted mb-8">
                Make sure to check your spam folder if the email does not arrive.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center md:text-left">
                <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-2">
                  Forgot Password
                </h1>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  Enter your email address and we'll send you a password reset link.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className={labelClass} htmlFor="forgot-email">Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={inputClass}
                    placeholder="john@email.com"
                    id="forgot-email"
                    autoComplete="email"
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  id="forgot-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-text-muted">
                  Remember your password?{" "}
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
