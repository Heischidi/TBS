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
    <section className="section bg-surface-1 border-t border-white/5">
      <div className="section-inner">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 border border-brand-pink/30 rounded-full mb-8">
              <Mail size={22} className="text-brand-pink" />
            </div>

            <h2 className="font-display text-3xl md:text-5xl text-white mb-5">
              STAY IN THE LOOP
            </h2>
            <p className="text-text-secondary text-sm mb-10 leading-relaxed max-w-md mx-auto">
              Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
              No spam. Just culture.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-neon-pink"
              >
                <CheckCircle size={22} />
                <span className="font-medium uppercase tracking-widest text-sm">
                  You&apos;re on the list!
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 input-dark px-5 py-4 text-sm rounded-none"
                  id="newsletter-email"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-pink text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-pink/85 transition-colors disabled:opacity-50 shrink-0"
                  id="newsletter-submit"
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>
            )}

            <p className="text-text-muted text-xs mt-5">
              Unsubscribe anytime. We respect your inbox.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
