import { useRef, useEffect, useState } from "react";

/**
 * ModelComparison — animated bar chart showing classification accuracy
 * across all baselines and model variants. The story: 305 params beats GPT-5.
 *
 * Y-axis zoomed to 80–100% so the gap between GPT-5 and ours is viscerally clear.
 * Low baselines (Random, Majority) shown as small stubs with a break marker.
 */

interface Model {
  label: string;
  accuracy: number;
  color: string;
  isOurs?: boolean;
}

const MODELS: Model[] = [
  { label: "Random", accuracy: 9.7, color: "var(--color-text-muted)" },
  { label: "Majority", accuracy: 18.2, color: "var(--color-text-muted)" },
  { label: "4o-mini\n0-shot", accuracy: 89.8, color: "#f59e0b" },
  { label: "4o-mini\nfew", accuracy: 91.1, color: "#f59e0b" },
  { label: "GPT-5\n0-shot", accuracy: 97.3, color: "#dc2626" },
  { label: "GPT-5\nfew", accuracy: 97.9, color: "#dc2626" },
  { label: "Ours\nNER", accuracy: 93.9, color: "var(--color-violet)" },
  { label: "Ours\nSA", accuracy: 97.5, color: "var(--color-teal)", isOurs: true },
  { label: "Ours\nfull", accuracy: 98.3, color: "var(--color-blue)", isOurs: true },
];

// Zoomed Y-axis range
const Y_MIN = 85;
const Y_MAX = 100;

// Map accuracy to 0..1 bar height in the zoomed range
function barFraction(accuracy: number): number {
  if (accuracy < Y_MIN) return 0.04; // Small stub for out-of-range baselines
  return (accuracy - Y_MIN) / (Y_MAX - Y_MIN);
}

const ModelComparison = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, 1 - (rect.top - window.innerHeight * 0.6) / (window.innerHeight * 0.3))
      );
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-5 md:p-6 h-full flex flex-col"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-1">
          <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
            Classification Accuracy
          </span>
          <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
            305 params
          </span>
        </div>

        {/* Y-axis scale markers */}
        <div className="relative flex-1 flex">
          {/* Y labels on left */}
          <div className="flex flex-col justify-between pr-1.5 py-1 shrink-0">
            {[100, 95, 90, 85].map((v) => (
              <span
                key={v}
                className="text-[8px] font-mono text-[var(--color-text-muted)] leading-none"
              >
                {v}%
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 relative">
            {/* Grid lines */}
            {[100, 95, 90, 85].map((v, idx) => (
              <div
                key={v}
                className="absolute left-0 right-0 border-t border-[var(--color-text)]"
                style={{
                  top: `${(idx / 3) * 100}%`,
                  opacity: v === 100 ? 0.15 : 0.06,
                }}
              />
            ))}

            {/* Our best reference line */}
            <div
              className="absolute left-0 right-0 border-t-[2px] border-dashed border-[var(--color-blue)] z-[1]"
              style={{
                top: `${(1 - barFraction(98.3)) * 100}%`,
                opacity: 0.25,
              }}
            />

            {/* Bars */}
            <div className="flex items-end gap-[2px] md:gap-1 h-full">
              {MODELS.map((m, i) => {
                const fraction = barFraction(m.accuracy);
                const barHeight = fraction * progress;
                const isHovered = hoveredIdx === i;
                const stagger = Math.min(1, Math.max(0, progress * 1.8 - i * 0.08));
                const isBelow = m.accuracy < Y_MIN;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full relative"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    data-cursor-hover
                  >
                    {/* Value label */}
                    <span
                      className="text-[8px] md:text-[10px] font-mono font-bold mb-0.5 transition-opacity duration-300"
                      style={{
                        color: m.isOurs ? m.color : "var(--color-text)",
                        opacity: stagger > 0.5 ? 1 : 0,
                      }}
                    >
                      {m.accuracy}%
                    </span>

                    {/* Bar */}
                    <div
                      className="w-full border-[2px] border-[var(--color-text)] transition-all duration-700 ease-out relative"
                      style={{
                        height: `${barHeight * 100}%`,
                        backgroundColor: m.color,
                        transitionDelay: `${i * 60}ms`,
                        opacity: isBelow ? 0.4 : 1,
                        transform: isHovered ? "scaleX(1.06)" : "scaleX(1)",
                        boxShadow: isHovered ? "2px 2px 0px var(--color-text)" : "none",
                      }}
                    >
                      {/* Break marker for out-of-range values */}
                      {isBelow && (
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                          <span className="text-[7px] font-mono text-[var(--color-text-muted)] leading-none mt-0.5">
                            ↓
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tooltip */}
                    {isHovered && (
                      <div
                        className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--color-text)] text-[var(--color-bg)] text-[8px] font-mono font-bold whitespace-nowrap z-20"
                        style={{ boxShadow: "2px 2px 0px var(--color-text-muted)" }}
                      >
                        {m.label.replace("\n", " ")}: {m.accuracy}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex mt-1.5 ml-7">
          {MODELS.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[6px] md:text-[7px] font-mono text-[var(--color-text-muted)] leading-tight whitespace-pre-line">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
