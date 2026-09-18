"use client";

import { useState } from "react";
import { Mail, Share2, CheckCircle, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

/* --- WhatsApp SVG --------------------------------------------- */
const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* --- Instagram SVG -------------------------------------------- */
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
    {
      label: "WhatsApp",
      value: "+234 800 000 0000",
      description: "Average reply time: Instant",
      href: WA_LINK,
      icon: <WhatsAppIcon size={18} />,
      color: "#25D366",
      fast: true,
    },
    {
      label: "Email",
      value: "hello@tbs.com",
      description: "For press & partnerships",
      href: "mailto:hello@tbs.com",
      icon: <Mail size={18} />,
      color: "#c9a84c",
      fast: false,
    },
    {
      label: "Instagram",
      value: "@tbs_official",
      description: "DM us for quick updates",
      href: "https://instagram.com/tbs_official",
      icon: <InstagramIcon size={18} />,
      color: "#E1306C",
      fast: false,
    },
  ];

  const inputStyle = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "rgba(255,255,255,0.85)",
  } as React.CSSProperties;

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#c9a84c";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#2a2a2a";
  };

  return (
    <>
      <div className="min-h-screen bg-black pt-28 pb-32 px-5 md:px-10">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full blur-[120px]" style={{ background: "rgba(201,168,76,0.04)" }} />
        </div>

        <div className="max-w-5xl mx-auto relative">

          {/* -- Hero heading ------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-24"
          >
            {/* Online badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[10px] uppercase tracking-widest font-medium" style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              We&apos;re Online
            </div>

            <h1
              className="text-6xl md:text-8xl font-black text-white leading-none mb-5"
              style={{ fontFamily: "var(--font-inter)", letterSpacing: "-0.03em" }}
            >
              LET&apos;S{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TALK
              </em>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-md leading-relaxed">
              Have a question about an order, collaboration, or custom drop? Reach out � we&apos;re always listening.
            </p>
          </motion.div>

          {/* -- Two-column layout ------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

            {/* -- Left: contact cards --------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="lg:col-span-2 space-y-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5 font-semibold">
                Reach us directly
              </p>

              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.055)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${c.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${c.color}18`, color: c.color }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] uppercase tracking-widest text-white/30">{c.label}</p>
                        {c.fast && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono" style={{ background: "rgba(37,211,102,0.1)", color: "#25D366" }}>FAST</span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium mt-0.5">{c.value}</p>
                      <p className="text-white/25 text-xs mt-0.5">{c.description}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                </a>
              ))}

              {/* Info card */}
              <div
                className="mt-4 p-4 rounded-2xl space-y-2.5"
                style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
              >
                <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Clock size={14} style={{ color: "#c9a84c" }} />
                  Mon � Sat � 9 AM � 6 PM WAT
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <MapPin size={14} style={{ color: "#c9a84c" }} />
                  Lagos, Nigeria � Worldwide Shipping
                </div>
              </div>
            </motion.div>

            {/* -- Right: form ------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
              className="lg:col-span-3 rounded-3xl p-7 md:p-9"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366" }}>
                      <CheckCircle size={30} />
                    </div>
                    <p className="text-white text-base font-semibold">Sent to WhatsApp!</p>
                    <p className="text-white/40 text-sm max-w-xs">We&apos;ll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Send us a message
                    </p>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Your Name", key: "name", type: "text", placeholder: "John Doe" },
                        { label: "Email Address", key: "email", type: "email", placeholder: "john@email.com" },
                      ].map((f) => (
                        <div key={f.key}>
                          <label
                            htmlFor={`contact-${f.key}`}
                            className="block text-[9px] uppercase tracking-widest mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {f.label}
                          </label>
                          <input
                            id={`contact-${f.key}`}
                            type={f.type}
                            required
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/20 transition-colors duration-200 focus:outline-none"
                            style={inputStyle}
                            onFocus={focusStyle}
                            onBlur={blurStyle}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className="block text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        placeholder="Order inquiry, collaboration�"
                        className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/20 transition-colors duration-200 focus:outline-none"
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="What's on your mind?"
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/20 transition-colors duration-200 focus:outline-none resize-none"
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      id="contact-submit"
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #1ebe57, #25D366)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <WhatsAppIcon size={18} />
                      Send via WhatsApp
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* -- Floating WhatsApp bubble ---------------------------- */}
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
          style={{
            background: "linear-gradient(135deg, #1ebe57, #25D366)",
            boxShadow: "0 8px 30px rgba(37,211,102,0.4)",
          }}
        >
          <WhatsAppIcon size={26} />
        </motion.a>
      </div>
    </>
  );
}

