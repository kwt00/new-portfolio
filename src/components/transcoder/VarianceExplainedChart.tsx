import { useState } from "react";

const data = [
  { L: 0, iter: 0.897, e2e: 0.370 },
  { L: 1, iter: 0.837, e2e: -5.245 },
  { L: 2, iter: 0.983, e2e: -0.186 },
  { L: 3, iter: 0.526, e2e: -6.538 },
  { L: 4, iter: 0.454, e2e: -8.487 },
  { L: 5, iter: 0.422, e2e: -6.094 },
  { L: 6, iter: 0.442, e2e: -4.689 },
  { L: 7, iter: 0.455, e2e: -3.369 },
  { L: 8, iter: 0.484, e2e: -2.186 },
  { L: 9, iter: 0.574, e2e: -1.082 },
  { L: 10, iter: 0.811, e2e: 0.150 },
  { L: 11, iter: 0.872, e2e: 0.292 },
];

const W = 720, H = 360;
const pad = { t: 40, r: 28, b: 56, l: 70 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;
const yMin = -2.0, yMax = 1.0; // clipped at -200% so chart stays readable
const groupW = innerW / data.length;
const barW = (groupW - 8) / 2;

const yOf = (v: number) => pad.t + (1 - (Math.max(yMin, v) - yMin) / (yMax - yMin)) * innerH;
const yZero = yOf(0);

const VarianceExplainedChart = () => {
  const [hover, setHover] = useState<{ i: number; method: "iter" | "e2e" } | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Per-layer variance explained">
        {[1.0, 0.5, 0, -0.5, -1.0, -1.5, -2.0].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="var(--color-border)" strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? "none" : "2 4"} />
            <text x={pad.l - 8} y={yOf(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{(v * 100).toFixed(0)}%</text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = pad.l + groupW * i + groupW / 2;
          const iX = cx - barW - 1.5;
          const eX = cx + 1.5;
          const iY = yOf(d.iter);
          const eY = yOf(d.e2e);
          const iTop = Math.min(iY, yZero);
          const iH = Math.abs(iY - yZero);
          const eTop = Math.min(eY, yZero);
          const eH = Math.abs(eY - yZero);
          const eClipped = d.e2e < yMin;
          const dim = (m: "iter" | "e2e") => hover && (hover.i !== i || hover.method !== m) ? 0.35 : 1;
          return (
            <g key={i}>
              <rect x={iX} y={iTop} width={barW} height={iH} fill="var(--color-blue)" stroke="var(--color-text)" strokeWidth="1"
                opacity={dim("iter")}
                onMouseEnter={() => setHover({ i, method: "iter" })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
              <rect x={eX} y={eTop} width={barW} height={eH} fill="var(--color-pink)" stroke="var(--color-text)" strokeWidth="1"
                opacity={dim("e2e")}
                onMouseEnter={() => setHover({ i, method: "e2e" })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
              {eClipped && (
                <g onMouseEnter={() => setHover({ i, method: "e2e" })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                  <polygon points={`${eX + barW / 2 - 5},${H - pad.b} ${eX + barW / 2 + 5},${H - pad.b} ${eX + barW / 2},${H - pad.b + 8}`} fill="var(--color-pink)" stroke="var(--color-text)" strokeWidth="0.75" />
                </g>
              )}
              <text x={cx} y={H - pad.b + 24} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)">{d.L}</text>
            </g>
          );
        })}

        {/* zero line emphasized */}
        <line x1={pad.l} x2={W - pad.r} y1={yZero} y2={yZero} stroke="var(--color-text)" strokeWidth="1" />

        {/* Legend */}
        <g transform={`translate(${pad.l}, 16)`}>
          <rect x="0" y="0" width="11" height="11" fill="var(--color-blue)" stroke="var(--color-text)" strokeWidth="1" />
          <text x="16" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.1em">ITERATIVE</text>
          <rect x="100" y="0" width="11" height="11" fill="var(--color-pink)" stroke="var(--color-text)" strokeWidth="1" />
          <text x="116" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.1em">E2E</text>
          <text x="180" y="10" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)" letterSpacing="0.1em">triangle = clipped below -200%</text>
        </g>

        {/* axis labels */}
        <text x={pad.l + innerW / 2} y={H - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em">LAYER</text>
        <text x={14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>VARIANCE EXPLAINED</text>
      </svg>
      {hover && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${((pad.l + groupW * hover.i + groupW / 2) / W) * 100}%`,
            top: `${(Math.max(pad.t, yOf(hover.method === "iter" ? data[hover.i].iter : data[hover.i].e2e)) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            whiteSpace: "nowrap",
          }}
        >
          {hover.method === "iter" ? "Iter" : "E2E"} L{data[hover.i].L} / {((hover.method === "iter" ? data[hover.i].iter : data[hover.i].e2e) * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default VarianceExplainedChart;
