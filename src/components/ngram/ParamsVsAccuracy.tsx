import { useRef, useEffect, useState } from "react";

/**
 * ParamsVsAccuracy — the absurdity chart. 305 parameters vs ~1T,
 * same accuracy. Log-scale X axis makes the gap visceral.
 */

interface DataPoint {
  label: string;
  params: number;       // actual param count
  accuracy: number;     // percentage
  color: string;
  marker: "star" | "circle";
}

const DATA: DataPoint[] = [
  { label: "Ours (305)", params: 305, accuracy: 98.3, color: "var(--color-blue)", marker: "star" },
  { label: "GPT-4o-mini", params: 8e9, accuracy: 91.1, color: "#f59e0b", marker: "circle" },
  { label: "GPT-5", params: 1e12, accuracy: 97.9, color: "#dc2626", marker: "circle" },
];

// Log scale mapping
const LOG_MIN = Math.log10(100);       // 10^2
const LOG_MAX = Math.log10(1e13);      // 10^13
function logX(params: number): number {
  return (Math.log10(params) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

// Y mapping (85% - 102%)
const Y_MIN = 85;
const Y_MAX = 102;
function yPos(accuracy: number): number {
  return 1 - (accuracy - Y_MIN) / (Y_MAX - Y_MIN);
}

const ParamsVsAccuracy = () => {
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

  const chartPadding = { top: 30, right: 30, bottom: 50, left: 50 };

  return (
    <div ref={containerRef} className="w-full h-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-5 md:p-6 h-full"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <div className="relative w-full" style={{ paddingBottom: "70%" }}>
          <svg
            viewBox="0 0 500 350"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
          >
            {/* Grid lines */}
            {[88, 90, 92, 94, 96, 98, 100].map((v) => {
              const y = chartPadding.top + yPos(v) * (350 - chartPadding.top - chartPadding.bottom);
              return (
                <g key={v}>
                  <line
                    x1={chartPadding.left}
                    x2={500 - chartPadding.right}
                    y1={y}
                    y2={y}
                    stroke="var(--color-text)"
                    strokeOpacity={0.08}
                    strokeWidth={1}
                  />
                  <text
                    x={chartPadding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono"
                    fill="var(--color-text-muted)"
                  >
                    {v}%
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {[1e3, 1e5, 1e7, 1e9, 1e11, 1e13].map((v) => {
              const x = chartPadding.left + logX(v) * (500 - chartPadding.left - chartPadding.right);
              const exp = Math.log10(v);
              return (
                <g key={v}>
                  <line
                    x1={x}
                    x2={x}
                    y1={chartPadding.top}
                    y2={350 - chartPadding.bottom}
                    stroke="var(--color-text)"
                    strokeOpacity={0.06}
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={350 - chartPadding.bottom + 18}
                    textAnchor="middle"
                    className="text-[9px] font-mono"
                    fill="var(--color-text-muted)"
                  >
                    10{exp > 0 ? `^${exp}` : "⁰"}
                  </text>
                </g>
              );
            })}

            {/* Axis labels */}
            <text
              x={250}
              y={350 - 5}
              textAnchor="middle"
              className="text-[9px] font-mono uppercase"
              fill="var(--color-text-muted)"
              letterSpacing="0.1em"
            >
              Parameters (log scale)
            </text>
            <text
              x={12}
              y={175}
              textAnchor="middle"
              className="text-[9px] font-mono uppercase"
              fill="var(--color-text-muted)"
              letterSpacing="0.1em"
              transform="rotate(-90, 12, 175)"
            >
              Accuracy (%)
            </text>

            {/* Our accuracy reference line */}
            <line
              x1={chartPadding.left}
              x2={500 - chartPadding.right}
              y1={chartPadding.top + yPos(98.3) * (350 - chartPadding.top - chartPadding.bottom)}
              y2={chartPadding.top + yPos(98.3) * (350 - chartPadding.top - chartPadding.bottom)}
              stroke="var(--color-blue)"
              strokeOpacity={0.25}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />

            {/* Data points */}
            {DATA.map((d, i) => {
              const cx = chartPadding.left + logX(d.params) * (500 - chartPadding.left - chartPadding.right);
              const cy = chartPadding.top + yPos(d.accuracy) * (350 - chartPadding.top - chartPadding.bottom);
              const isHovered = hoveredIdx === i;
              const delay = i * 0.15;
              const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

              return (
                <g
                  key={i}
                  style={{
                    transform: `scale(${pointProgress})`,
                    transformOrigin: `${cx}px ${cy}px`,
                    transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: `${delay}s`,
                  }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  data-cursor-hover
                >
                  {d.marker === "star" ? (
                    <>
                      {/* Highlight glow */}
                      <circle cx={cx} cy={cy} r={28} fill="var(--color-blue)" fillOpacity={0.08} />
                      {/* Star */}
                      <polygon
                        points={starPoints(cx, cy, isHovered ? 14 : 11, isHovered ? 6 : 5)}
                        fill={d.color}
                        stroke="var(--color-text)"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 10 : 8}
                      fill={d.color}
                      stroke="var(--color-text)"
                      strokeWidth={2}
                      style={{ transition: "r 0.2s" }}
                    />
                  )}

                  {/* Label */}
                  <text
                    x={cx + (i === 0 ? 18 : -14)}
                    y={cy - 16}
                    textAnchor={i === 0 ? "start" : "end"}
                    className="text-[10px] font-mono font-bold"
                    fill="var(--color-text)"
                    style={{ opacity: pointProgress }}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* Annotation: "305 params → same accuracy as 1T" */}
            <g
              style={{
                opacity: Math.max(0, (progress - 0.5) * 2),
                transition: "opacity 0.5s ease",
              }}
            >
              <rect
                x={chartPadding.left + 5}
                y={chartPadding.top + 2}
                width={155}
                height={36}
                fill="var(--color-blue)"
                fillOpacity={0.08}
                stroke="none"
              />
              <text
                x={chartPadding.left + 10}
                y={chartPadding.top + 16}
                className="text-[9px] font-mono"
                fill="var(--color-blue)"
                fontStyle="italic"
              >
                305 params →
              </text>
              <text
                x={chartPadding.left + 10}
                y={chartPadding.top + 30}
                className="text-[9px] font-mono"
                fill="var(--color-blue)"
                fontStyle="italic"
              >
                matches GPT-5 accuracy
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + (2 * Math.PI * i) / 5;
    const innerAngle = outerAngle + Math.PI / 5;
    points.push(`${cx + outerR * Math.cos(outerAngle)},${cy - outerR * Math.sin(outerAngle)}`);
    points.push(`${cx + innerR * Math.cos(innerAngle)},${cy - innerR * Math.sin(innerAngle)}`);
  }
  return points.join(" ");
}

export default ParamsVsAccuracy;
