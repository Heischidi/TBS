import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          <InstagramIcon />
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
          Copyright © {new Date().getFullYear()}, <span style={{ fontFamily: "var(--font-brand)" }}>TBS</span>.
        </p>

      </div>
    </footer>
  );
}
