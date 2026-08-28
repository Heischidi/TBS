"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully. Please sign in.");
    } else if (searchParams.get("reset") === "success") {
      setSuccess("Password updated successfully. Please sign in with your new password.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const inputClass = "w-full input-dark pl-9 pr-10 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-2 border border-white/5 p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-pink" />

      <div className="mb-8 text-center md:text-left">
        <h1 className="font-display text-3xl text-white tracking-widest uppercase mb-2">
          Sign In
        </h1>
        <p className="text-xs text-text-muted uppercase tracking-wider">
          Access your orders, wishlist, and profile details.
        </p>
      </div>

      {success && (
        <div className="bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 mb-6 rounded-sm uppercase tracking-wider">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="login-email">Email Address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@email.com"
              className={inputClass}
              id="login-email"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs uppercase tracking-wider text-text-secondary" htmlFor="login-password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] uppercase tracking-wider text-text-muted hover:text-brand-pink transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputClass}
              id="login-password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-4 font-medium uppercase tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          id="login-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-text-muted">
          New to TBS?{" "}
          <Link
            href="/signup"
            className="text-white hover:text-brand-pink transition-colors uppercase tracking-wider font-medium ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-20 flex items-start justify-center">
      <div className="w-full max-w-md px-4">
        <div className="mb-8">
          <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-3">Welcome Back</p>
          <h1 className="font-display text-4xl md:text-5xl text-white">SIGN IN</h1>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-brand-pink" size={32} />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
