"use client";

import { useState } from "react";
import { Mail, MessageSquare, Share2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waMsg = `*Contact Form*\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000"}?text=${encodeURIComponent(waMsg)}`, "_blank");
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  const contacts = [
    {
      label: "WhatsApp",
      value: "+234 800 000 0000",
      href: "https://wa.me/2348000000000",
      icon: MessageSquare,
    },
    {
      label: "Email",
      value: "hello@tbs.com",
      href: "mailto:hello@tbs.com",
      icon: Mail,
    },
    {
      label: "Instagram",
      value: "@tbs_official",
      href: "https://instagram.com/tbs_official",
      icon: Share2,
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-28 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-5">Get in Touch</p>
          <h1 className="font-display text-6xl md:text-8xl text-white tracking-wide">
            LET&apos;S TALK
          </h1>
          <p className="text-white/50 text-sm mt-6 max-w-sm mx-auto leading-relaxed">
            Have a question about an order? Want to collab? Or just want to say what&apos;s good? We&apos;re always listening.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-0"
          >
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-6 border-b border-white/10 hover:border-white/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                      <Icon size={16} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">{c.label}</p>
                      <p className="text-white text-sm font-medium group-hover:text-white/70 transition-colors">{c.value}</p>
                    </div>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 text-xs transition-colors">→</span>
                </a>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <CheckCircle size={32} className="text-white/60" />
                <p className="text-white text-sm uppercase tracking-widest">Message sent to WhatsApp</p>
                <p className="text-white/30 text-xs">We&apos;ll get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { label: "Your Name", key: "name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "john@email.com" },
                  { label: "Subject", key: "subject", type: "text", placeholder: "Order inquiry, collaboration…" },
                ].map((field) => (
                  <div key={field.key} className="border-b border-white/15 pb-2 focus-within:border-white/50 transition-colors">
                    <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                      id={`contact-${field.key}`}
                    />
                  </div>
                ))}

                <div className="border-b border-white/15 pb-2 focus-within:border-white/50 transition-colors">
                  <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none"
                    id="contact-message"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:text-white/50 hover:border-white/50 transition-colors"
                  id="contact-submit"
                >
                  <MessageSquare size={13} />
                  Send via WhatsApp
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
