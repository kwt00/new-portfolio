import { useState } from "react";

const layers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const iter_all = [1.000, 0.624, 0.393, 0.171, 0.167, 0.170, 0.175, 0.157, 0.180, 0.179, 0.191, 0.230];
const iter_anc = [1.000, 1.000, 0.745, 0.567, 0.460, 0.448, 0.526, 0.605, 0.735, 0.782, 0.793, 0.762];
const e2e_all  = [1.000, 0.682, 0.309, 0.184, 0.157, 0.168, 0.171, 0.161, 0.175, 0.203, 0.242, 0.219];

const series = [
  { key: "iter_all", label: "ITER ALL-SPARSE", values: iter_all, color: "var(--color-blue)" },
  { key: "iter_anc", label: "ITER + ANCHORS",  values: iter_anc, color: "var(--color-teal)" },
  { key: "e2e_all",  label: "E2E ALL-SPARSE",  values: e2e_all,  color: "var(--color-pink)" },
];

const W = 720, H = 360;
const pad = { t: 40, r: 28, b: 56, l: 60 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;

const xOf = (i: number) => pad.l + (i / (layers.length - 1)) * innerW;
const yOf = (v: number) => pad.t + (1 - v) * innerH;

const AttentionCosineChart = () => {
  const [hover, setHover] = useState<{ s: number; i: number } | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Per-layer attention cosine similarity">
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={yOf(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{v.toFixed(2)}</text>
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />
        {layers.map((L, i) => (
          <text key={L} x={xOf(i)} y={H - pad.b + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{L}</text>
        ))}

        {series.map((s, si) => (
          <g key={s.key}>
            <polyline
              points={s.values.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={hover && hover.s !== si ? 1 : 2}
              opacity={hover && hover.s !== si ? 0.35 : 1}
              style={{ transition: "opacity 0.15s" }}
            />
            {s.values.map((v, i) => (
              <circle
                key={i}
                cx={xOf(i)}
                cy={yOf(v)}
                r={hover && hover.s === si && hover.i === i ? 6 : 3}
                fill={s.color}
                stroke="var(--color-text)"
                strokeWidth="1"
                opacity={hover && hover.s !== si ? 0.35 : 1}
                onMouseEnter={() => setHover({ s: si, i })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "r 0.15s, opacity 0.15s" }}
              />
            ))}
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${pad.l}, 14)`}>
          {series.map((s, si) => (
            <g key={s.key} transform={`translate(${si * 170}, 0)`}>
              <rect x="0" y="0" width="14" height="3" fill={s.color} />
              <circle cx="7" cy="1.5" r="3.5" fill={s.color} stroke="var(--color-text)" strokeWidth="0.75" />
              <text x="20" y="6" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text)" letterSpacing="0.08em">{s.label}</text>
            </g>
          ))}
        </g>

        <text x={pad.l + innerW / 2} y={H - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em">LAYER</text>
        <text x={14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>ATTN COSINE SIMILARITY</text>
      </svg>
      {hover && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${(xOf(hover.i) / W) * 100}%`,
            top: `${(yOf(series[hover.s].values[hover.i]) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            whiteSpace: "nowrap",
          }}
        >
          {series[hover.s].label} / L{layers[hover.i]} / {series[hover.s].values[hover.i].toFixed(3)}
        </div>
      )}
    </div>
  );
};

export default AttentionCosineChart;
