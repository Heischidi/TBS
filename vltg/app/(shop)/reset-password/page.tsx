"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must match password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError("Reset token is missing. Please check the link in your email.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full input-dark pl-4 pr-10 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  if (!token) {
    return (
      <div className="text-center py-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
          Invalid request. No password reset token was provided.
        </div>
        <p className="text-sm text-text-muted mb-8">
          Please check the link sent to your email or request a new reset link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-2">
          New Password
        </h1>
        <p className="text-xs text-text-muted uppercase tracking-wider">
          Token verified. Set your new password to secure your account.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="reset-password">New Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              className={inputClass}
              placeholder="••••••••"
              id="reset-password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="reset-confirm-password">Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPass ? "text" : "password"}
              className={inputClass}
              placeholder="••••••••"
              id="reset-confirm-password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
              {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={errorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          id="reset-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Resetting Password...
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen pt-44 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-2 border border-white/5 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-pink" />
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-brand-pink" size={32} />
            </div>
          }>
            <ResetPasswordFormContent />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
