export function MarqueeStrip() {
  const items = [
    "FREE WORLDWIDE SHIPPING",
    "PREMIUM QUALITY GUARANTEED",
    "LIMITED EDITION DROPS",
    "NEW ARRIVALS WEEKLY",
    "EXCLUSIVE STREETWEAR",
    "CRAFTED FOR THE CULTURE",
  ];

  return (
    <div className="bg-surface-2 border-y border-white/5 py-4 overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 mx-8 text-xs font-bold uppercase tracking-[0.3em] text-text-secondary whitespace-nowrap"
          >
            {item}
            <span className="text-brand-pink">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
