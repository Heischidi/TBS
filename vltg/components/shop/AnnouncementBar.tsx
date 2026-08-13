"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";

const messages = [
  { text: "🔥 FLASH SALE — Up to 60% Off Sitewide", link: "/shop" },
  { text: "🚚 FREE SHIPPING on orders over ₦50,000", link: "/shop" },
  { text: "↩ Easy 30-Day Returns — Shop Risk-Free", link: "/about" },
  { text: "⚡ LIMITED DROPS — New items every Friday", link: "/new-arrivals" },
];

function useCountdown(targetHours: number) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });

  useEffect(() => {
    const totalSecs = targetHours * 3600;
    let remaining = totalSecs;
    const tick = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setTime({ h, m, s });
    }, 1000);
    return () => clearInterval(tick);
  }, [targetHours]);

  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function AnnouncementBar() {
  const pathname = usePathname();
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const time = useCountdown(8);

  // Hide on all admin pages
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const msg = messages[current];

  return (
    <div className="announcement-bar relative z-50" id="announcement-bar">
      <div className="flex items-center justify-center gap-4 px-4 py-2.5">
        {/* Scrolling message */}
        <Link
          href={msg.link}
          className="text-white text-xs font-semibold tracking-wide hover:underline underline-offset-2 text-center transition-all duration-300"
        >
          {msg.text}
        </Link>

        {/* Countdown for first message */}
        {current === 0 && (
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-white/60 text-[10px] uppercase tracking-widest mr-1">Ends in</span>
            <span className="countdown-digit text-sm">{pad(time.h)}</span>
            <span className="countdown-separator text-sm">:</span>
            <span className="countdown-digit text-sm">{pad(time.m)}</span>
            <span className="countdown-separator text-sm">:</span>
            <span className="countdown-digit text-sm">{pad(time.s)}</span>
          </div>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
