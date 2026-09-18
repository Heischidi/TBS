"use client";

import { useState } from "react";
import { Mail, Share2, CheckCircle, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [waBubble, setWaBubble] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waMsg = `*TBS Contact*\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage: ${form.message}`;
    window.open(`${WA_LINK}?text=${encodeURIComponent(waMsg)}`, "_blank");
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const contacts = [
    { label: "WhatsApp", value: "+234 800 000 0000", description: "Instant replies", href: WA_LINK, icon: <WhatsAppIcon size={20} />, color: "#25D366", fast: true },
    { label: "Email", value: "hello@tbs.com", description: "Press & partnerships", href: "mailto:hello@tbs.com", icon: <Mail size={20} />, color: "#c9a84c", fast: false },
    { label: "Instagram", value: "@tbs_official", description: "DMs & quick updates", href: "https://instagram.com/tbs_official", icon: <InstagramIcon size={20} />, color: "#E1306C", fast: false },
  ];

  const inputStyle = { background: "#111", border: "1px solid #2a2a2a", color: "rgba(255,255,255,0.85)" } as React.CSSProperties;
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "#c9a84c"; };
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "#2a2a2a"; };

  return (
    <>
      <div className="min-h-screen bg-black text-white">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <div className="pt-36 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs uppercase tracking-widest font-semibold"
              style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              We&apos;re online — reply within minutes
            </div>

            <p className="text-2xl md:text-3xl font-semibold text-white mb-3" style={{ letterSpacing: "-0.01em" }}>
              Get in touch
            </p>
            <p className="text-base md:text-lg max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Questions about an order, a collab, or a custom drop? Reach out — we&apos;re always listening.
            </p>
          </motion.div>
        </div>


        {/* ── DIVIDER ───────────────────────────────────────────── */}
        <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* ── BODY ──────────────────────────────────────────────── */}
        <div className="px-6 md:px-16 max-w-7xl mx-auto py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 items-start">

            {/* ── LEFT: contact cards ──────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-2 space-y-4"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8" style={{ color: "rgba(255,255,255,0.25)" }}>
                Direct Channels
              </p>

              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-5 rounded-2xl transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${c.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${c.color}18`, color: c.color }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</p>
                        {c.fast && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono" style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}>FAST</span>
                        )}
                      </div>
                      <p className="text-white text-base font-semibold">{c.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{c.description}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                </a>
              ))}

              {/* Hours */}
              <div
                className="mt-6 p-5 rounded-2xl space-y-3"
                style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <div className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Clock size={15} style={{ color: "#c9a84c" }} />
                  Mon – Sat · 9 AM – 6 PM WAT
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <MapPin size={15} style={{ color: "#c9a84c" }} />
                  Lagos, Nigeria · Worldwide Shipping
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: form ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-3 rounded-3xl p-8 md:p-10"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-5 py-24 text-center"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366" }}
                    >
                      <CheckCircle size={36} />
                    </div>
                    <p className="text-white text-xl font-bold">Sent to WhatsApp!</p>
                    <p className="text-base max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>We&apos;ll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Send us a message
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { label: "Your Name", key: "name", type: "text", placeholder: "John Doe" },
                        { label: "Email Address", key: "email", type: "email", placeholder: "john@email.com" },
                      ].map((f) => (
                        <div key={f.key}>
                          <label htmlFor={`contact-${f.key}`} className="block text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {f.label}
                          </label>
                          <input
                            id={`contact-${f.key}`}
                            type={f.type}
                            required
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-white/20 focus:outline-none transition-colors duration-200"
                            style={inputStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        placeholder="Order inquiry, collaboration…"
                        className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-white/20 focus:outline-none transition-colors duration-200"
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="What's on your mind?"
                        rows={6}
                        className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-white/20 focus:outline-none transition-colors duration-200 resize-none"
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>

                    <button
                      id="contact-submit"
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 py-5 rounded-xl font-bold text-base text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, #1ebe57, #25D366)", letterSpacing: "0.05em" }}
                    >
                      <WhatsAppIcon size={20} />
                      Send via WhatsApp
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Floating WhatsApp bubble ─────────────────────────────── */}
      <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {waBubble && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl px-4 py-3 text-sm text-white shadow-2xl whitespace-nowrap"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="font-semibold">Chat with us</span>
              <span style={{ color: "rgba(255,255,255,0.45)" }}> on WhatsApp</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          onMouseEnter={() => setWaBubble(true)}
          onMouseLeave={() => setWaBubble(false)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #1ebe57, #25D366)", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
        >
          <WhatsAppIcon size={26} />
        </motion.a>
      </div>
    </>
  );
}