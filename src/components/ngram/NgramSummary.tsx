import { useRef, useEffect, useState } from "react";

/**
 * NgramSummary - triple metric comparison: Accuracy, Latency, Cost.
 * Our 305-param model dominates all three axes.
 */

interface Metric {
  title: string;
  unit: string;
  models: { label: string; value: number; display: string; color: string }[];
  /** If true, lower is better (inverted: bar goes right = worse) */
  lowerBetter?: boolean;
}

const METRICS: Metric[] = [
  {
    title: "Accuracy",
    unit: "%",
    models: [
      { label: "GPT-4o-mini", value: 91.1, display: "91.1%", color: "#f59e0b" },
      { label: "GPT-5", value: 97.9, display: "97.9%", color: "#dc2626" },
      { label: "Ours (305)", value: 98.3, display: "98.3%", color: "var(--color-blue)" },
    ],
  },
  {
    title: "Latency",
    unit: "seconds",
    lowerBetter: true,
    models: [
      { label: "GPT-4o-mini", value: 55, display: "55s", color: "#f59e0b" },
      { label: "GPT-5", value: 1296, display: "~22min", color: "#dc2626" },
      { label: "Ours (305)", value: 30, display: "30s", color: "var(--color-blue)" },
    ],
  },
  {
    title: "Cost",
    unit: "$",
    lowerBetter: true,
    models: [
      { label: "GPT-4o-mini", value: 0.10, display: "$0.10", color: "#f59e0b" },
      { label: "GPT-5", value: 5.00, display: "$5.00", color: "#dc2626" },
      { label: "Ours (305)", value: 0, display: "$0.00", color: "var(--color-blue)" },
    ],
  },
];

const NgramSummary = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
    <div ref={containerRef} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {METRICS.map((metric, mi) => {
          const maxVal = Math.max(...metric.models.map((m) => m.value));
          const effectiveMax = metric.lowerBetter ? maxVal : 105;

          return (
            <div
              key={mi}
              className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-4"
              style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
            >
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] mb-4">
                {metric.title}{" "}
                <span className="text-[var(--color-text-muted)] font-normal">({metric.unit})</span>
              </h4>

              <div className="space-y-3">
                {metric.models.map((m, i) => {
                  const barRatio = metric.lowerBetter
                    ? m.value / effectiveMax
                    : m.value / effectiveMax;
                  const stagger = Math.max(0, Math.min(1, (progress - mi * 0.1 - i * 0.05) * 2));
                  const barWidth = barRatio * 100 * stagger;

                  const isOurs = m.label.includes("Ours");

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[9px] font-mono uppercase tracking-[0.05em] ${
                            isOurs ? "font-bold text-[var(--color-blue)]" : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {m.label}
                        </span>
                        <span
                          className="text-[12px] font-mono font-bold"
                          style={{ color: m.color, opacity: stagger }}
                        >
                          {m.display}
                        </span>
                      </div>
                      <div className="h-4 bg-[var(--color-bg)] border-[2px] border-[var(--color-text)] overflow-hidden">
                        <div
                          className="h-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.max(barWidth, m.value === 0 ? 0 : 2)}%`,
                            backgroundColor: m.color,
                            transitionDelay: `${mi * 100 + i * 80}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Winner callout */}
              {metric.lowerBetter ? (
                <div className="mt-3 text-[9px] font-mono text-[var(--color-blue)] font-bold uppercase tracking-[0.1em]">
                  {metric.title === "Cost" ? "Free - no API calls" : "43x faster than GPT-5"}
                </div>
              ) : (
                <div className="mt-3 text-[9px] font-mono text-[var(--color-blue)] font-bold uppercase tracking-[0.1em]">
                  Highest accuracy overall
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NgramSummary;
