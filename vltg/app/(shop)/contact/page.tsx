"use client";

import { useState } from "react";
import { Mail, Phone, Share2, Link2, MessageSquare } from "lucide-react";
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

  const inputClass = "w-full input-dark px-4 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";

  return (
    <div className="min-h-screen pt-44 md:pt-48 pb-24 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-8"
          >
            <div>
              <span className="text-brand-pink text-xs font-bold uppercase tracking-[0.3em] block mb-3">
                Get in Touch
              </span>
              <h1 className="font-display text-5xl md:text-6xl text-white leading-none tracking-tight">
                LET'S TALK
              </h1>
              <p className="text-text-secondary text-sm md:text-base mt-4 leading-relaxed">
                Have a question about an order? Want to collab? Or just want to say what's good? We're always listening.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/2348000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-surface-2 hover:bg-surface-3 border border-white/5 hover:border-brand-pink/30 rounded-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-pink/10 group-hover:bg-brand-pink/20 flex items-center justify-center transition-colors">
                  <MessageSquare size={18} className="text-brand-pink" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">WhatsApp</p>
                  <p className="text-white text-sm font-medium mt-0.5 group-hover:text-brand-pink transition-colors">+234 800 000 0000</p>
                </div>
              </a>

              {/* Email Card */}
              <a 
                href="mailto:hello@tbs.com"
                className="flex items-center gap-4 p-4 bg-surface-2 hover:bg-surface-3 border border-white/5 hover:border-brand-pink/30 rounded-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-pink/10 group-hover:bg-brand-pink/20 flex items-center justify-center transition-colors">
                  <Mail size={18} className="text-brand-pink" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-white text-sm font-medium mt-0.5 group-hover:text-brand-pink transition-colors">hello@tbs.com</p>
                </div>
              </a>

              {/* Instagram Card */}
              <a 
                href="https://instagram.com/tbs_official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-surface-2 hover:bg-surface-3 border border-white/5 hover:border-brand-pink/30 rounded-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-pink/10 group-hover:bg-brand-pink/20 flex items-center justify-center transition-colors">
                  <Share2 size={18} className="text-brand-pink" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Instagram</p>
                  <p className="text-white text-sm font-medium mt-0.5 group-hover:text-brand-pink transition-colors">@tbs_official</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Premium Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-7 bg-surface-2 border border-white/5 p-6 md:p-8 rounded-sm shadow-card"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
                    className={inputClass} 
                    placeholder="John Doe" 
                    id="contact-name" 
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} 
                    className={inputClass} 
                    placeholder="john@email.com" 
                    id="contact-email" 
                  />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Subject</label>
                <input 
                  required 
                  value={form.subject} 
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} 
                  className={inputClass} 
                  placeholder="Order inquiry, collaboration..." 
                  id="contact-subject" 
                />
              </div>
              
              <div>
                <label className={labelClass}>Message</label>
                <textarea 
                  required 
                  value={form.message} 
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} 
                  className={`${inputClass} h-36 resize-none`} 
                  placeholder="What's on your mind?" 
                  id="contact-message" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white py-4 font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-glow-pink/10 hover:shadow-glow-pink/20" 
                id="contact-submit"
              >
                <MessageSquare size={14} /> Send via WhatsApp
              </button>
              
              {sent && (
                <p className="text-neon-pink text-xs font-semibold text-center mt-2">
                  Message draft generated! Redirecting to WhatsApp...
                </p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
