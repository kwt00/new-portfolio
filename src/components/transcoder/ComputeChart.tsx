import { useState } from "react";

interface Pt {
  label: string;
  time: number;       // minutes
  kl: number;
  mem: string;
  color: string;
  shape: "circle" | "square" | "diamond";
}

const points: Pt[] = [
  { label: "Iterative all-sparse",     time: 40,  kl: 0.720, mem: "1.2 GB", color: "var(--color-blue)", shape: "circle" },
  { label: "Iterative + anchors",      time: 40,  kl: 0.283, mem: "1.2 GB", color: "var(--color-teal)", shape: "square" },
  { label: "E2E all-sparse (3-seed)",  time: 739, kl: 0.426, mem: "4+ GB",  color: "var(--color-pink)", shape: "diamond" },
];

const W = 640, H = 340;
const pad = { t: 32, r: 30, b: 56, l: 70 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;

const tMin = 10, tMax = 1500; // log range
const tlog = (v: number) => Math.log10(v);
const xOf = (t: number) => pad.l + (tlog(t) - tlog(tMin)) / (tlog(tMax) - tlog(tMin)) * innerW;
const yOf = (k: number) => pad.t + (k / 1.0) * innerH;

const Marker = ({ x, y, r, color, shape, on, onEnter, onLeave }: {
  x: number; y: number; r: number; color: string; shape: Pt["shape"];
  on: boolean; onEnter: () => void; onLeave: () => void;
}) => {
  const common = {
    fill: color,
    stroke: "var(--color-text)",
    strokeWidth: 1.25,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    style: { cursor: "pointer", transition: "all 0.15s" } as React.CSSProperties,
  };
  const size = on ? r * 1.5 : r;
  if (shape === "circle") return <circle cx={x} cy={y} r={size} {...common} />;
  if (shape === "square") return <rect x={x - size} y={y - size} width={size * 2} height={size * 2} {...common} />;
  return <polygon points={`${x},${y - size * 1.2} ${x + size * 1.2},${y} ${x},${y + size * 1.2} ${x - size * 1.2},${y}`} {...common} />;
};

const ComputeChart = () => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Compute vs fidelity">
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={yOf(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{v.toFixed(2)}</text>
          </g>
        ))}
        {[10, 50, 100, 500, 1000].map((t) => (
          <g key={t}>
            <line x1={xOf(t)} x2={xOf(t)} y1={pad.t} y2={H - pad.b} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={xOf(t)} y={H - pad.b + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{t}m</text>
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />

        {/* speed-up arrow from E2E to iter */}
        <line x1={xOf(739)} y1={yOf(0.426)} x2={xOf(40) + 14} y2={yOf(0.720) - 4} stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="2 3" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text-muted)" />
          </marker>
        </defs>
        <text x={(xOf(739) + xOf(40)) / 2} y={yOf(0.55)} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontStyle="italic" fill="var(--color-text-muted)">18.5x faster</text>

        {points.map((p, i) => {
          const x = xOf(p.time);
          const y = yOf(p.kl);
          return (
            <g key={i}>
              <Marker x={x} y={y} r={9} color={p.color} shape={p.shape} on={hover === i}
                onEnter={() => setHover(i)} onLeave={() => setHover(null)} />
              <text x={x + 16} y={y + 4} fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">
                {p.label}
              </text>
              <text x={x + 16} y={y + 17} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">
                {p.time}m / KL {p.kl.toFixed(3)} / {p.mem}
              </text>
            </g>
          );
        })}

        <text x={pad.l + innerW / 2} y={H - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em">TRAINING TIME (LOG, MIN)</text>
        <text x={14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>KL DIVERGENCE</text>
      </svg>
      {hover !== null && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${(xOf(points[hover].time) / W) * 100}%`,
            top: `${(yOf(points[hover].kl) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 14px))",
            whiteSpace: "nowrap",
          }}
        >
          {points[hover].label} / {points[hover].time}m / KL {points[hover].kl.toFixed(3)} / {points[hover].mem}
        </div>
      )}
    </div>
  );
};

export default ComputeChart;
