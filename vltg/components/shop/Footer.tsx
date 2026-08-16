import Link from "next/link";
import { Instagram } from "lucide-react";

const links = [
  { href: "/new-arrivals",  label: "NEW ARRIVALS"    },
  { href: "/contact",       label: "NEWSLETTER"       },
  { href: "/shipping",      label: "SHIPPING POLICY"  },
  { href: "/terms",         label: "TERMS OF SERVICE" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-8 py-14">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* Instagram icon */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-text-secondary hover:text-white transition-colors"
        >
          <Instagram size={20} />
        </a>

        {/* Nav links */}
        <nav className="flex flex-col items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium tracking-widest text-text-secondary hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-text-muted text-[10px] tracking-widest mt-2">
          Copyright © {new Date().getFullYear()}, TBS.
        </p>

      </div>
    </footer>
  );
}
