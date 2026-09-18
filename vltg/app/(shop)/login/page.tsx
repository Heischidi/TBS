"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/* ─── Remember-me toggle ─────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        background: checked
          ? "linear-gradient(135deg, #c9a84c, #e8c97a)"
          : "#2a2a2a",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/* ─── Social button ───────────────────────────────────────────── */
function SocialBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-medium text-white/80 transition-all duration-200 hover:text-white hover:border-white/20"
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Google SVG ─────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path
      d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      fill="#FFC107"
    />
    <path
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      fill="#FF3D00"
    />
    <path
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      fill="#4CAF50"
    />
    <path
      d="M43.611 20.083H42V20H24v8h11.303a11.937 11.937 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      fill="#1976D2"
    />
  </svg>
);

/* ─── Apple SVG ──────────────────────────────────────────────── */
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

/* ─── Main login form ─────────────────────────────────────────── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully. Please sign in.");
    } else if (searchParams.get("reset") === "success") {
      setSuccess(
        "Password updated successfully. Please sign in with your new password."
      );
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
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* ── Heading ─────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2"
          style={{ fontFamily: "var(--font-inter)", letterSpacing: "-0.02em" }}
        >
          Welcome{" "}
          <em
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}
          >
            back
          </em>
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Sign in to access your orders, wishlist &amp; profile.
        </p>
      </div>

      {/* ── Card ────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-7"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Alerts */}
        {success && (
          <div className="mb-5 p-3.5 rounded-lg text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-5 p-3.5 rounded-lg text-xs text-red-400 bg-red-400/10 border border-red-400/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200 focus:outline-none"
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "rgba(255,255,255,0.8)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm transition-colors duration-200 focus:outline-none"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "rgba(255,255,255,0.8)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#c9a84c")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#2a2a2a")
                }
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <Toggle checked={rememberMe} onChange={setRememberMe} />
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "#c9a84c" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In <span className="ml-0.5">→</span>
              </>
            )}
          </button>
        </form>

        {/* Create account */}
        <p
          className="text-center text-sm mt-5"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          New to TBS?{" "}
          <Link
            href="/signup"
            className="font-semibold text-white hover:opacity-80 transition-opacity"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* ── Social sign-in ──────────────────────────────────────── */}
      <div className="mt-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            or continue with
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        <div className="flex gap-3">
          <SocialBtn
            icon={<GoogleIcon />}
            label="Google"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          />
          <SocialBtn
            icon={<AppleIcon />}
            label="Apple"
            onClick={() => signIn("apple", { callbackUrl: "/" })}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page wrapper ────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin" size={28} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
