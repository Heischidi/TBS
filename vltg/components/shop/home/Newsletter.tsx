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
    <section
      style={{
        width: "100%",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Circle mail icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <Mail size={20} color="white" />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            color: "#fff",
            letterSpacing: "0.05em",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          STAY IN THE LOOP
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.9rem",
            lineHeight: 1.75,
            maxWidth: "360px",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          Be the first to know about new drops, exclusive offers, and
          behind-the-scenes content. No spam. Just culture.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#fff" }}
          >
            <CheckCircle size={20} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              You&apos;re on the list!
            </span>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "420px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "1rem",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: "0.5rem",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                id="newsletter-email"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "0.875rem",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                id="newsletter-submit"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flexShrink: 0,
                  opacity: loading ? 0.4 : 1,
                  padding: 0,
                }}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </div>
          </form>
        )}

        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.7rem",
            marginTop: "1.5rem",
            textAlign: "center",
          }}
        >
          Unsubscribe anytime. We respect your inbox.
        </p>
      </motion.div>
    </section>
  );
}
