import { useEffect, useRef, useState } from "react";

/**
 * LogitDecomposition — diverging horizontal bar chart for the
 * canonical "The capital of France is → Paris" decomposition.
 *
 * 4 components: embedding, attention heads (raw), routing delta, MLPs.
 * Heads + MLPs + embedding all OPPOSE the correct answer (negative);
 * routing OVERRIDES with +25.57.
 *
 * Layout: fixed column grid [LABEL | BAR_TRACK | VALUE] so nothing overlaps.
 */

interface Component {
  label: string;
  value: number;
  color: string;
  description: string;
}

const COMPONENTS: Component[] = [
  { label: "EMBEDDING", value: -0.12, color: "var(--color-text-muted)", description: "tiny" },
  { label: "ATTN HEADS", value: -4.94, color: "var(--color-blue)", description: "actively oppose" },
  { label: "ROUTING DELTA", value: 25.57, color: "var(--color-pink)", description: "overrides" },
  { label: "MLPS", value: -3.81, color: "var(--color-text-muted)", description: "net negative" },
];

const TOTAL = COMPONENTS.reduce((s, c) => s + c.value, 0);

// Diverging chart range
const VMIN = -8;
const VMAX = 28;
const RANGE = VMAX - VMIN;
const ZERO_PCT = (-VMIN / RANGE) * 100; // ≈ 22.2%

const LogitDecomposition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-4 sm:p-5"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">
          Logit attribution to " Paris"
        </div>
        <div className="font-mono text-[11px] font-bold text-[var(--color-text)] mb-5">
          "The capital of France is →"
        </div>

        {/* Chart: 3-column grid — [label | bar | value] */}
        <div className="grid gap-x-3 gap-y-2.5" style={{ gridTemplateColumns: "minmax(95px, max-content) 1fr minmax(70px, max-content)" }}>
          {COMPONENTS.map((c) => {
            const isPositive = c.value > 0;
            const widthPct = (Math.abs(c.value) / RANGE) * 100 * progress;
            const startPct = isPositive ? ZERO_PCT : ZERO_PCT - widthPct;

            return (
              <div key={c.label} className="contents">
                {/* Label */}
                <div className="flex items-center justify-end font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text)]">
                  {c.label}
                </div>

                {/* Bar track */}
                <div className="relative h-9 border-[2px] border-[var(--color-text)] bg-[var(--color-bg)]">
                  {/* Zero line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-[var(--color-text)] opacity-60"
                    style={{ left: `${ZERO_PCT}%` }}
                  />
                  {/* Bar */}
                  <div
                    className="absolute top-0 bottom-0 transition-all duration-500"
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      background: c.color,
                    }}
                  />
                </div>

                {/* Numeric value + description */}
                <div className="flex items-center">
                  <span
                    className="font-mono text-[12px] font-bold tabular-nums whitespace-nowrap"
                    style={{ color: c.color, opacity: progress }}
                  >
                    {c.value > 0 ? "+" : ""}{c.value.toFixed(2)}
                  </span>
                  <span className="hidden sm:inline ml-2 font-serif italic text-[11px] text-[var(--color-text-muted)] whitespace-nowrap">
                    {c.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-5 pt-3 border-t-[2px] border-[var(--color-text)] flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Final logit (sum)
          </span>
          <span className="font-mono text-[14px] font-bold text-[var(--color-text)]">
            {TOTAL > 0 ? "+" : ""}{TOTAL.toFixed(2)}{" "}
            <span className="text-[var(--color-text-muted)] font-normal text-[12px]">
              · top pred " the" · P(Paris) = 0.119%
            </span>
          </span>
        </div>

        <div className="mt-4 font-serif italic text-[12px] leading-[1.6] text-[var(--color-text-muted)]">
          Heads contribute −4.94 logits — they actively oppose the correct
          answer. Routing contributes +25.57. Without routing, the model can't
          make this prediction at all.
        </div>
      </div>
    </div>
  );
};

export default LogitDecomposition;
