/**
 * Double-row marquee ticker — outlined / stamp style.
 * Text is bold dark outlines on beige, with small colored accent squares.
 * Visually distinct from the filled comic-book CTA buttons.
 */

const row1 = [
  { text: "REACT", color: "var(--color-blue)" },
  { text: "TYPESCRIPT", color: "var(--color-violet)" },
  { text: "PYTHON", color: "var(--color-teal)" },
  { text: "AI / ML", color: "var(--color-pink)" },
  { text: "NEXT.JS", color: "var(--color-orange)" },
  { text: "DEVREL", color: "var(--color-blue)" },
  { text: "NODE.JS", color: "var(--color-violet)" },
  { text: "INFERENCE", color: "var(--color-teal)" },
  { text: "LLMs", color: "var(--color-pink)" },
  { text: "MIDWAY", color: "var(--color-blue)" },
  { text: "HACKATHONS", color: "var(--color-orange)" },
];

const row2 = [
  { text: "GROWTH", color: "var(--color-orange)" },
  { text: "CEREBRAS", color: "var(--color-pink)" },
  { text: "PYTORCH", color: "var(--color-blue)" },
  { text: "CLI TOOLS", color: "var(--color-teal)" },
  { text: "COMMUNITY", color: "var(--color-violet)" },
  { text: "WEBGL", color: "var(--color-orange)" },
  { text: "AGENTS", color: "var(--color-pink)" },
  { text: "RESEARCH", color: "var(--color-blue)" },
  { text: "VENTURE", color: "var(--color-teal)" },
  { text: "CLOUD", color: "var(--color-orange)" },
  { text: "OPEN SOURCE", color: "var(--color-violet)" },
];

const MarqueeRow = ({
  items,
  reverse = false,
  speed = 30,
}: {
  items: { text: string; color: string }[];
  reverse?: boolean;
  speed?: number;
}) => {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y-[4px] border-[var(--color-text)] bg-[var(--color-bg)]">
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0 gap-3 px-6 py-3">
            {/* Small colored accent square */}
            <span
              className="w-2.5 h-2.5 shrink-0"
              style={{ backgroundColor: item.color }}
            />
            {/* Outlined dark text — no fill */}
            <span className="text-[14px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--color-text)] whitespace-nowrap">
              {item.text}
            </span>
            {/* Thin separator */}
            <span className="w-[3px] h-4 bg-[var(--color-border)] ml-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Marquee = () => {
  return (
    <div className="relative">
      <MarqueeRow items={row1} speed={35} />
      <MarqueeRow items={row2} reverse speed={28} />
    </div>
  );
};

export default Marquee;
