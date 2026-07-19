import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primaries
        "brand-black": "#000000",
        "brand-white": "#FFFFFF",
        "brand-grey": "#7A7A7A",
        // Accent colors
        "brand-green": "#0B3D2E",
        "brand-pink": "#FF1493",
        "brand-maroon": "#800020",
        // Surface shades
        "surface-1": "#0A0A0A",
        "surface-2": "#111111",
        "surface-3": "#1A1A1A",
        "surface-4": "#222222",
        "surface-5": "#2A2A2A",
        // Text shades
        "text-primary": "#F5F5F5",
        "text-secondary": "#9A9A9A",
        "text-muted": "#5A5A5A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "Bebas Neue", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(4rem, 12vw, 12rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display": ["clamp(2.5rem, 6vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
        "headline": ["clamp(1.5rem, 3vw, 3rem)", { lineHeight: "1", letterSpacing: "0.05em" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 25s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #000000 0%, #0B3D2E 100%)",
        "gradient-pink": "linear-gradient(135deg, #800020 0%, #FF1493 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },
      boxShadow: {
        "glow-pink": "0 0 30px rgba(255, 20, 147, 0.3)",
        "glow-green": "0 0 30px rgba(11, 61, 46, 0.5)",
        "card": "0 4px 24px rgba(0,0,0,0.5)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.7)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
