import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TBS",
  description: "Learn about TBS — a premium streetwear brand crafting bold, limited-edition pieces.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-brand-pink text-xs font-bold uppercase tracking-[0.4em] mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-8">BUILT FOR THE CULTURE</h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>TBS was born from a simple belief: great design should be accessible, but never ordinary. We craft premium streetwear for those who understand that what you wear is a statement — about your values, your energy, and your vision.</p>
            <p>Every piece in the TBS catalog starts with one question: does this move culture forward? We don’t chase trends. We set them, then leave them behind before they get crowded.</p>
            <p>Our drops are limited. Our quality is not. 100% premium cotton. Meticulous construction. Every stitch placed with intention.</p>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5">
            {[
              { label: "Limited Drops", value: "100+" },
              { label: "Premium Materials", value: "100%" },
              { label: "Culture First", value: "Always" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl text-brand-pink">{stat.value}</p>
                <p className="text-text-muted text-xs uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
