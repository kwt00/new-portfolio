import { useState } from "react";

interface Bar {
  config: string;
  short: string;
  kl: number;
  top1: number;
  color: string;
  note?: string;
}

const data: Bar[] = [
  { config: "Iterative all-sparse", short: "Iter\nall-sparse", kl: 0.719, top1: 0.558, color: "var(--color-blue)" },
  { config: "Iterative + 6 anchors", short: "Iter\n+ anchors", kl: 0.285, top1: 0.712, color: "var(--color-teal)", note: "best fidelity" },
  { config: "E2E all-sparse", short: "E2E\nall-sparse", kl: 0.613, top1: 0.657, color: "var(--color-pink)" },
];

const W = 640, H = 340;
const pad = { t: 30, r: 60, b: 60, l: 60 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;
const klMax = 0.9;
const groupW = innerW / data.length;
const barW = (groupW - 24) / 2;

const FidelityChart = () => {
  const [hover, setHover] = useState<{ i: number; metric: "kl" | "top1" } | null>(null);

  const yKL = (v: number) => pad.t + (1 - v / klMax) * innerH;
  const yTop = (v: number) => pad.t + (1 - v) * innerH;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Fidelity comparison">
        {/* gridlines + left axis labels (KL) */}
        {[0, 0.3, 0.6, 0.9].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yKL(v)} y2={yKL(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={yKL(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{v.toFixed(1)}</text>
          </g>
        ))}
        {/* right axis labels (Top-1) */}
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <text key={v} x={W - pad.r + 8} y={yTop(v) + 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{(v * 100).toFixed(0)}%</text>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />

        {data.map((d, i) => {
          const cx = pad.l + groupW * i + groupW / 2;
          const klX = cx - barW - 4;
          const topX = cx + 4;
          const klBarTop = yKL(d.kl);
          const topBarTop = yTop(d.top1);
          return (
            <g key={i}>
              {/* KL bar */}
              <rect
                x={klX}
                y={klBarTop}
                width={barW}
                height={H - pad.b - klBarTop}
                fill={d.color}
                stroke="var(--color-text)"
                strokeWidth="1.25"
                opacity={hover && hover.i !== i ? 0.5 : 1}
                onMouseEnter={() => setHover({ i, metric: "kl" })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              />
              {/* Top-1 bar (lighter, hatched feel via opacity) */}
              <rect
                x={topX}
                y={topBarTop}
                width={barW}
                height={H - pad.b - topBarTop}
                fill={d.color}
                fillOpacity="0.35"
                stroke="var(--color-text)"
                strokeWidth="1.25"
                strokeDasharray="3 2"
                opacity={hover && hover.i !== i ? 0.5 : 1}
                onMouseEnter={() => setHover({ i, metric: "top1" })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              />
              {/* config label */}
              {d.short.split("\n").map((line, li) => (
                <text key={li} x={cx} y={H - pad.b + 16 + li * 12} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)">{line}</text>
              ))}
              {/* values on bars */}
              <text x={klX + barW / 2} y={klBarTop - 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">{d.kl.toFixed(3)}</text>
              <text x={topX + barW / 2} y={topBarTop - 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text-muted)">{(d.top1 * 100).toFixed(1)}%</text>
            </g>
          );
        })}

        {/* axis labels */}
        <text x={20} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 20 ${pad.t + innerH / 2})`}>KL DIVERGENCE</text>
        <text x={W - 14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 ${W - 14} ${pad.t + innerH / 2})`}>TOP-1 MATCH</text>

        {/* legend */}
        <g transform={`translate(${pad.l}, 14)`}>
          <rect x="0" y="0" width="10" height="10" fill="var(--color-text)" />
          <text x="14" y="9" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)" letterSpacing="0.1em">SOLID = KL</text>
          <rect x="100" y="0" width="10" height="10" fill="var(--color-text)" fillOpacity="0.35" stroke="var(--color-text)" strokeDasharray="2 1.5" />
          <text x="114" y="9" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)" letterSpacing="0.1em">DASHED = TOP-1</text>
        </g>
      </svg>
      {hover && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${((pad.l + groupW * hover.i + groupW / 2) / W) * 100}%`,
            top: hover.metric === "kl" ? `${(yKL(data[hover.i].kl) / H) * 100}%` : `${(yTop(data[hover.i].top1) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            whiteSpace: "nowrap",
          }}
        >
          {data[hover.i].config}
          {" / "}
          {hover.metric === "kl" ? `KL ${data[hover.i].kl.toFixed(3)}` : `Top-1 ${(data[hover.i].top1 * 100).toFixed(1)}%`}
        </div>
      )}
    </div>
  );
};

export default FidelityChart;
