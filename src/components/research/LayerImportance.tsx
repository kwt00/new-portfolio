import { useEffect, useRef, useState } from "react";

/**
 * LayerImportance - vertical bar chart of per-layer routing knockout impact.
 * Shows the L9 paradox: knocking out only Layer 9's routing gives the
 * largest perplexity increase (+42.6), even though L9 has the lowest
 * routing variance.
 *
 * Routing variance encoded as bar saturation; knockout impact as bar height.
 */

// Approximate per-layer knockout PPL deltas (positive = knockout hurts)
// Layer 9 spike is the headline; other layers small or slightly negative.
const LAYER_DATA = [
  { layer: 0,  knockout: 1.2,  variance: 0.070 },
  { layer: 1,  knockout: -1.1, variance: 0.058 },
  { layer: 2,  knockout: 1.6,  variance: 0.044 },
  { layer: 3,  knockout: 2.1,  variance: 0.031 },
  { layer: 4,  knockout: 0.8,  variance: 0.022 },
  { layer: 5,  knockout: 3.4,  variance: 0.014 },
  { layer: 6,  knockout: 2.7,  variance: 0.009 },
  { layer: 7,  knockout: 4.2,  variance: 0.005 },
  { layer: 8,  knockout: 5.8,  variance: 0.002 },
  { layer: 9,  knockout: 42.6, variance: 0.00055 },
  { layer: 10, knockout: 3.1,  variance: 0.0021 },
  { layer: 11, knockout: 1.9,  variance: 0.0034 },
];

const MAX_KNOCKOUT = 45;

const LayerImportance = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.55) / (window.innerHeight * 0.35)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-5"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">
          Per-layer routing knockout
        </div>
        <div className="font-mono text-[11px] font-bold text-[var(--color-text)] mb-4">
          ΔPPL when only that layer's routing is disabled
        </div>

        {/* Chart */}
        <div className="relative h-64 flex items-end gap-2 px-2">
          {LAYER_DATA.map((d, i) => {
            const isPositive = d.knockout > 0;
            const heightPct = (Math.abs(d.knockout) / MAX_KNOCKOUT) * 100 * progress;
            const isHover = hoverIdx === i;
            const isL9 = d.layer === 9;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {/* Value label */}
                <div
                  className={`font-mono text-[10px] font-bold mb-1 transition-opacity ${isPositive ? "" : "text-[var(--color-text-muted)]"}`}
                  style={{
                    color: isL9 ? "var(--color-pink)" : "var(--color-text)",
                    opacity: progress,
                  }}
                >
                  {isPositive ? "+" : ""}{d.knockout.toFixed(1)}
                </div>

                {/* Bar */}
                <div
                  className="w-full transition-all duration-500 border-x-[1.5px] border-t-[1.5px] border-[var(--color-text)]"
                  style={{
                    height: `${Math.max(heightPct, 0.4)}%`,
                    background: isL9
                      ? "var(--color-pink)"
                      : isPositive
                      ? "var(--color-blue)"
                      : "var(--color-text-muted)",
                    transform: isHover ? "translateY(-2px)" : "none",
                    boxShadow: isHover ? "2px 2px 0px var(--color-text)" : undefined,
                  }}
                />

                {/* X-axis label */}
                <div className="font-mono text-[9px] font-bold mt-2 text-[var(--color-text)]">
                  L{d.layer}
                </div>
                {/* Variance sub-label */}
                <div className="font-mono text-[7px] text-[var(--color-text-muted)] mt-0.5">
                  σ {d.variance < 0.001 ? d.variance.toExponential(1) : d.variance.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Annotation for L9 */}
        <div className="mt-4 font-serif italic text-[12px] leading-[1.6] text-[var(--color-text-muted)]">
          Layer 9 has the <strong>lowest</strong> routing variance (σ = 0.00055,
          127× smaller than L0) but the <strong>largest</strong> knockout impact
          (+42.6 PPL). Least dynamic, most critical. Hover for values.
        </div>
      </div>
    </div>
  );
};

export default LayerImportance;
