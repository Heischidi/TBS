import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TBS | The Black Sheep",
  description:
    "TBS was born from a simple belief: great design should be accessible, but never ordinary. Premium streetwear for those who understand that what you wear is a statement.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        {/* Background accent */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,20,147,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(128,0,32,0.07) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="section-inner relative">
          <p
            className="text-xs font-bold uppercase tracking-[0.4em] mb-6"
            style={{ color: "#FF1493" }}
          >
            Our Story
          </p>
          <h1
            className="font-display leading-none mb-0"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)", color: "#fff" }}
          >
            BUILT FOR
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #800020, #FF1493)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              THE CULTURE
            </span>
          </h1>
        </div>
      </section>

      {/* ── BODY COPY ─────────────────────────────────────── */}
      <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="section-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 6vw, 6rem)",
              alignItems: "start",
            }}
            className="about-grid"
          >
            {/* Left — sticky label */}
            <div style={{ position: "sticky", top: "8rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  background: "#FF1493",
                  marginBottom: "1.5rem",
                }}
              />
              <p
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  color: "rgba(255,255,255,0.08)",
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                }}
              >
                WHO
                <br />
                WE
                <br />
                ARE
              </p>
            </div>

            {/* Right — paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                  color: "#9A9A9A",
                  lineHeight: 1.8,
                }}
              >
                TBS was born from a simple belief: great design should be
                accessible, but never ordinary. We craft premium streetwear for
                those who understand that what you wear is a statement — about
                your values, your energy, and your vision.
              </p>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                  color: "#9A9A9A",
                  lineHeight: 1.8,
                }}
              >
                Every piece in the TBS catalog starts with one question: does
                this move culture forward? We don't chase trends. We set them,
                then leave them behind before they get crowded.
              </p>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                  color: "#9A9A9A",
                  lineHeight: 1.8,
                }}
              >
                Our drops are limited. Our quality is not. 100% premium cotton.
                Meticulous construction. Every stitch placed with intention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { value: "100+", label: "Limited Drops" },
              { value: "100%", label: "Premium Materials" },
              { value: "Always", label: "Culture First" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "3rem 2rem",
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <p
                  className="font-display"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, #800020, #FF1493)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#5A5A5A",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO QUOTE ───────────────────────────────── */}
      <section
        className="section"
        style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="section-inner">
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#FF1493",
                marginBottom: "2rem",
              }}
            >
              The Manifesto
            </p>
            <blockquote
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1.15,
                color: "#fff",
                letterSpacing: "0.03em",
              }}
            >
              "WE DON'T CHASE TRENDS.
              <br />
              <span style={{ color: "rgba(255,255,255,0.25)" }}>
                WE SET THEM, THEN LEAVE
                <br />
                THEM BEHIND BEFORE THEY
                <br />
                GET CROWDED."
              </span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#FF1493",
              marginBottom: "3rem",
            }}
          >
            What We Stand For
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {[
              {
                title: "INTENTION",
                body: "Nothing we make is accidental. Every cut, every colour, every drop is deliberate.",
              },
              {
                title: "SCARCITY",
                body: "Limited by design. We believe in creating things worth wanting — not things available everywhere.",
              },
              {
                title: "QUALITY",
                body: "100% premium cotton. Meticulous construction. The kind of quality that only reveals itself over time.",
              },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#000",
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    "#0A0A0A")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    "#000")
                }
              >
                <p
                  className="font-display"
                  style={{ fontSize: "1.5rem", color: "#fff", letterSpacing: "0.05em" }}
                >
                  {v.title}
                </p>
                <p style={{ fontSize: "14px", color: "#5A5A5A", lineHeight: 1.7 }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section
        className="section"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}
      >
        <div className="section-inner">
          <p
            className="font-display"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#fff", marginBottom: "2rem" }}
          >
            READY TO MAKE A STATEMENT?
          </p>
          <a
            href="/shop"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#000",
              padding: "1rem 3rem",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#FF1493";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
              (e.currentTarget as HTMLAnchorElement).style.color = "#000";
            }}
          >
            Shop the Collection
          </a>
        </div>
      </section>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
