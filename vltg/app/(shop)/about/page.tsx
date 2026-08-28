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
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="about-glow-1" aria-hidden="true" />
        <div className="about-glow-2" aria-hidden="true" />

        <div className="section-inner relative">
          <p className="about-eyebrow">Our Story</p>
          <h1 className="about-hero-title">
            BUILT FOR
            <br />
            <span className="gradient-text-pink">THE CULTURE</span>
          </h1>
        </div>
      </section>

      {/* ── BODY COPY ─────────────────────────────────────── */}
      <section className="section about-copy-section">
        <div className="section-inner">
          <div className="about-copy-grid">
            {/* Left — ghost label */}
            <div className="about-ghost-label-wrap">
              <div className="about-pink-rule" />
              <p className="about-ghost-label">WHO<br />WE<br />ARE</p>
            </div>

            {/* Right — paragraphs */}
            <div className="about-paragraphs">
              <p className="about-body-text">
                TBS was born from a simple belief: great design should be
                accessible, but never ordinary. We craft premium streetwear for
                those who understand that what you wear is a statement — about
                your values, your energy, and your vision.
              </p>
              <p className="about-body-text">
                Every piece in the TBS catalog starts with one question: does
                this move culture forward? We don&apos;t chase trends. We set them,
                then leave them behind before they get crowded.
              </p>
              <p className="about-body-text">
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
          <div className="about-stats-grid">
            {[
              { value: "100+", label: "Limited Drops" },
              { value: "100%", label: "Premium Materials" },
              { value: "Always", label: "Culture First" },
            ].map((stat, i) => (
              <div key={stat.label} className={`about-stat-cell${i < 2 ? " about-stat-border" : ""}`}>
                <p className="about-stat-value gradient-text-pink">{stat.value}</p>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO QUOTE ───────────────────────────────── */}
      <section className="section about-manifesto-section">
        <div className="section-inner">
          <div className="about-manifesto-inner">
            <p className="about-eyebrow">The Manifesto</p>
            <blockquote className="about-quote font-display">
              &ldquo;WE DON&apos;T CHASE TRENDS.{" "}
              <span className="about-quote-fade">
                WE SET THEM, THEN LEAVE THEM BEHIND BEFORE THEY GET CROWDED.&rdquo;
              </span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <p className="about-eyebrow" style={{ marginBottom: "3rem" }}>What We Stand For</p>
          <div className="about-values-grid">
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
              <div key={v.title} className="about-value-card">
                <p className="about-value-title font-display">{v.title}</p>
                <p className="about-value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section about-cta-section">
        <div className="section-inner" style={{ textAlign: "center" }}>
          <p className="about-cta-heading font-display">
            READY TO MAKE A STATEMENT?
          </p>
          <a href="/shop" className="about-cta-btn">
            Shop the Collection
          </a>
        </div>
      </section>

      <style>{`
        /* Glow blobs */
        .about-glow-1 {
          position: absolute; top: -10%; right: -5%;
          width: 600px; height: 600px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(255,20,147,0.06) 0%, transparent 70%);
        }
        .about-glow-2 {
          position: absolute; bottom: -20%; left: -10%;
          width: 500px; height: 500px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(128,0,32,0.07) 0%, transparent 70%);
        }

        /* Eyebrow */
        .about-eyebrow {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.4em; color: #6B7C3A; margin-bottom: 1.5rem;
        }

        /* Hero title */
        .about-hero-title {
          font-family: var(--font-bebas);
          font-size: clamp(4rem, 12vw, 10rem);
          line-height: 1; color: #fff;
        }

        /* Copy section */
        .about-copy-section { border-top: 1px solid rgba(255,255,255,0.05); }
        .about-copy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 6vw, 6rem);
          align-items: start;
        }
        .about-ghost-label-wrap { position: sticky; top: 8rem; }
        .about-pink-rule { width: 40px; height: 2px; background: #6B7C3A; margin-bottom: 1.5rem; }
        .about-ghost-label {
          font-family: var(--font-bebas);
          font-size: clamp(2rem, 4vw, 3.5rem);
          color: rgba(255,255,255,0.08);
          line-height: 1; letter-spacing: 0.05em;
        }
        .about-paragraphs { display: flex; flex-direction: column; gap: 2rem; }
        .about-body-text {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          color: #9A9A9A; line-height: 1.8;
        }

        /* Stats */
        .about-stats-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .about-stat-cell { padding: 3rem 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .about-stat-border { border-right: 1px solid rgba(255,255,255,0.06); }
        .about-stat-value {
          font-family: var(--font-bebas);
          font-size: clamp(3rem, 6vw, 5rem); line-height: 1;
        }
        .about-stat-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.2em; color: #5A5A5A;
        }

        /* Manifesto */
        .about-manifesto-section {
          background: #0A0A0A;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .about-manifesto-inner { max-width: 900px; margin: 0 auto; text-align: center; }
        .about-quote {
          font-size: clamp(1.75rem, 4vw, 3.5rem);
          line-height: 1.2; color: #fff; letter-spacing: 0.03em;
        }
        .about-quote-fade { color: rgba(255,255,255,0.22); }

        /* Values */
        .about-values-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.05);
        }
        .about-value-card {
          background: #000; padding: 2.5rem;
          display: flex; flex-direction: column; gap: 1rem;
          transition: background 0.2s;
        }
        .about-value-card:hover { background: #0A0A0A; }
        .about-value-title { font-size: 1.5rem; color: #fff; letter-spacing: 0.05em; }
        .about-value-body { font-size: 14px; color: #5A5A5A; line-height: 1.7; }

        /* CTA */
        .about-cta-section { border-top: 1px solid rgba(255,255,255,0.04); }
        .about-cta-heading {
          font-size: clamp(2rem, 5vw, 4rem); color: #fff; margin-bottom: 2rem;
        }
        .about-cta-btn {
          display: inline-block; background: #fff; color: #000;
          padding: 1rem 3rem; font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s, color 0.2s;
        }
        .about-cta-btn:hover { background: #6B7C3A; color: #fff; }

        /* Responsive */
        @media (max-width: 768px) {
          .about-copy-grid { grid-template-columns: 1fr !important; }
          .about-ghost-label-wrap { position: static; }
          .about-stats-grid { grid-template-columns: 1fr; }
          .about-stat-border { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .about-values-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
