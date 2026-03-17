import { useRef, useEffect, useState } from "react";

/**
 * Efficiency wins — animated horizontal bars showing only the good stuff.
 * All bars represent improvements the routed model achieves over baseline.
 */

interface Metric {
  label: string;
  value: number;      // The big number to display
  maxVal: number;     // Scale reference (100% = bar fills)
  display: string;    // Formatted string
  description: string;
  color: string;
}

const METRICS: Metric[] = [
  {
    label: "Perplexity Reduction",
    value: 56,
    maxVal: 60,
    display: "31–56%",
    description: "Routing becomes the dominant computational pathway",
    color: "var(--color-pink)",
  },
  {
    label: "Induction Accuracy",
    value: 93.4,
    maxVal: 100,
    display: "93.4→0%",
    description: "Disabling routing collapses induction to 0.0%",
    color: "var(--color-blue)",
  },
  {
    label: "Factual Recall",
    value: 100,
    maxVal: 100,
    display: "→ 0",
    description: "Near-zero probability across all 8 test prompts without routing",
    color: "var(--color-teal)",
  },
  {
    label: "Learned Directions",
    value: 576,
    maxVal: 576,
    display: "576",
    description: "Self-organized into orthogonal subspaces without explicit pressure",
    color: "var(--color-violet)",
  },
];

const EfficiencyBars = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.6) / (window.innerHeight * 0.3)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] divide-y-[2px] divide-[var(--color-text)]"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        {METRICS.map((m, i) => {
          const barWidth = (m.value / m.maxVal) * 100 * progress;

          return (
            <div key={i} className="px-5 py-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.1em]">
                  {m.label}
                </span>
                <span
                  className="text-lg font-mono font-bold tracking-tight"
                  style={{ color: m.color }}
                >
                  {m.display}
                </span>
              </div>
              <div className="h-5 bg-[var(--color-bg)] border-[2px] border-[var(--color-text)] overflow-hidden mb-1.5">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: m.color,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-[0.05em]">
                {m.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EfficiencyBars;
