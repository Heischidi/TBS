import Link from "next/link";
import { Share2, Link2, Tv, Mail } from "lucide-react";

const footerLinks = {
  Shop: [
    { href: "/shop",          label: "All Products"  },
    { href: "/new-arrivals",  label: "New Arrivals"  },
    { href: "/best-sellers",  label: "Best Sellers"  },
    { href: "/collections",   label: "Collections"   },
  ],
  Help: [
    { href: "/contact",  label: "Contact Us"    },
    { href: "/about",    label: "About TBS"     },
    { href: "/faq",      label: "FAQ"           },
    { href: "/shipping", label: "Shipping Info" },
  ],
  Legal: [
    { href: "/returns",  label: "Returns Policy"  },
    { href: "/privacy",  label: "Privacy Policy"  },
    { href: "/terms",    label: "Terms of Service" },
  ],
  Account: [
    { href: "/wishlist", label: "My Wishlist" },
    { href: "/cart",     label: "My Cart"     },
    { href: "/contact",  label: "Track Order" },
  ],
};

const paymentMethods = ["VISA", "Mastercard", "Verve", "Paystack", "Flutterwave", "Bank"];

const marqueeText =
  "NEW ARRIVALS ✦ FREE SHIPPING ON ORDERS OVER ₦50,000 ✦ EASY RETURNS ✦ LIMITED DROPS ✦ PREMIUM QUALITY ✦ ";

export function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-white/5 mt-8">

      {/* ── Marquee strip ─────────────────────────────────────── */}
      <div
        className="bg-brand-pink py-3"
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "max-content",
            animation: "marquee 28s linear infinite",
          }}
        >
          {/* Duplicate text so the loop is seamless */}
          {[0, 1].map((copy) => (
            <span
              key={copy}
              style={{ display: "inline-block" }}
              className="font-display text-black text-sm tracking-widest"
            >
              {Array(6).fill(marqueeText).join("")}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="section-inner py-16">

        {/* Brand block — centred */}
        <div className="text-center mb-14">
          <Link
            href="/"
            className="font-display text-6xl tracking-widest text-white hover:text-brand-pink transition-colors inline-block"
          >
            TBS
          </Link>
          <p className="text-text-secondary text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            Premium fashion for those who move culture forward. Bold pieces.
            Limited drops. Timeless quality.
          </p>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[
              { icon: Share2, href: "#",        label: "Instagram" },
              { icon: Link2,  href: "#",        label: "Twitter"   },
              { icon: Tv,     href: "#",        label: "TikTok"    },
              { icon: Mail,   href: "/contact", label: "Email"     },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-brand-pink transition-all rounded-sm"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          {/* App store buttons */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <a
              href="#"
              className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-text-secondary hover:text-white hover:border-white/30 transition-all rounded-sm"
            >
              🍎 App Store
            </a>
            <a
              href="#"
              className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-text-secondary hover:text-white hover:border-white/30 transition-all rounded-sm"
            >
              ▶ Google Play
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 mb-12" />

        {/* Link columns — centred group */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-3xl mx-auto text-center">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm tracking-widest text-white mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/5 text-center">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} TBS — The Black Sheep. All rights reserved.
          </p>
          <p className="text-text-muted text-xs mt-1.5">
            Made with precision. Built for the culture.
          </p>

          {/* Payment icons */}
          <div className="mt-6">
            <p className="text-text-muted text-[10px] uppercase tracking-widest mb-3">We accept</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {paymentMethods.map((method) => (
                <div key={method} className="payment-icon">{method}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
