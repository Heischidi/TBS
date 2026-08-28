"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-black border-t border-white/5 py-24 md:py-32">
      <div className="w-full max-w-xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          {/* Circle mail icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/30 mb-10">
            <Mail size={20} className="text-white" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl text-white mb-6 tracking-wide text-center">
            STAY IN THE LOOP
          </h2>

          <p className="text-white/60 text-sm md:text-base mb-12 leading-relaxed max-w-sm text-center">
            Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
            No spam. Just culture.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-white"
            >
              <CheckCircle size={20} />
              <span className="font-medium uppercase tracking-widest text-sm">
                You&apos;re on the list!
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="flex items-end gap-4 border-b border-white/30 pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
                  id="newsletter-email"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white text-xs font-bold uppercase tracking-widest shrink-0 hover:text-white/60 transition-colors disabled:opacity-40"
                  id="newsletter-submit"
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </div>
            </form>
          )}

          <p className="text-white/30 text-xs mt-6 text-center">
            Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
