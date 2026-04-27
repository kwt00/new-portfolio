import { useState } from "react";

const data = [
  { round: 0, kl: 0.8623 },
  { round: 1, kl: 0.7779 },
  { round: 2, kl: 0.7198 },
  { round: 3, kl: 0.7318 },
  { round: 4, kl: 0.7193 },
];

const W = 640, H = 320;
const pad = { t: 28, r: 24, b: 52, l: 60 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;
const yMin = 0.6, yMax = 0.9;

const xOf = (r: number) => pad.l + (r / 4) * innerW;
const yOf = (k: number) => pad.t + (1 - (k - yMin) / (yMax - yMin)) * innerH;

const ConvergenceChart = () => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Convergence across alternating rounds">
        {/* gridlines */}
        {[0.6, 0.7, 0.8, 0.9].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={pad.l - 10} y={yOf(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{v.toFixed(2)}</text>
          </g>
        ))}
        {/* baseline x-axis */}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />
        {data.map((d) => (
          <text key={d.round} x={xOf(d.round)} y={H - pad.b + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">R{d.round}</text>
        ))}
        {/* convergence threshold marker after R2 */}
        <line x1={xOf(2)} x2={xOf(2)} y1={pad.t} y2={H - pad.b} stroke="var(--color-teal)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <text x={xOf(2) + 6} y={pad.t + 12} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-teal)">delta-KL &lt; 0.015</text>
        {/* line */}
        <polyline points={data.map((d) => `${xOf(d.round)},${yOf(d.kl)}`).join(" ")} fill="none" stroke="var(--color-blue)" strokeWidth="2" />
        {/* points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xOf(d.round)}
            cy={yOf(d.kl)}
            r={hover === i ? 7 : 4.5}
            fill="var(--color-blue)"
            stroke="var(--color-text)"
            strokeWidth="1.5"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "pointer", transition: "r 0.15s" }}
          />
        ))}
        {/* axis labels */}
        <text x={pad.l + innerW / 2} y={H - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em">ROUND</text>
        <text x={14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>KL DIVERGENCE</text>
      </svg>
      {hover !== null && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${(xOf(data[hover].round) / W) * 100}%`,
            top: `${(yOf(data[hover].kl) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            whiteSpace: "nowrap",
          }}
        >
          R{data[hover].round} / KL {data[hover].kl.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default ConvergenceChart;
