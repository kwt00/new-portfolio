import { useState } from "react";

const mostActiveData = [
  { layer: 2, iter: 349.5, e2e: 635.8 },
  { layer: 4, iter: 299.8, e2e: 402.7 },
  { layer: 6, iter: 223.3, e2e: 348.3 },
  { layer: 8, iter: 99.3, e2e: 281.9 },
  { layer: 10, iter: 56.6, e2e: 279.4 },
];

const randomData = [
  { layer: 2, iter: 48.5, e2e: 175.0 },
  { layer: 4, iter: 43.6, e2e: 102.2 },
  { layer: 6, iter: 35.8, e2e: 89.3 },
  { layer: 8, iter: 18.5, e2e: 48.1 },
  { layer: 10, iter: 9.1, e2e: 16.9 },
];

const VIEWS = {
  "most-active": {
    label: "Most-active features",
    sub: "method-dependent selection",
    data: mostActiveData,
    yMax: 700,
    ratio: "1.89x",
    grand: { iter: 205.7, e2e: 389.6 },
  },
  random: {
    label: "Random features (matched seed)",
    sub: "method-independent selection",
    data: randomData,
    yMax: 200,
    ratio: "2.78x",
    grand: { iter: 31.1, e2e: 86.3 },
  },
} as const;

type ViewKey = keyof typeof VIEWS;

const W = 640, H = 320;
const pad = { t: 56, r: 28, b: 56, l: 64 };
const innerW = W - pad.l - pad.r;
const innerH = H - pad.t - pad.b;

const CascadeChart = () => {
  const [view, setView] = useState<ViewKey>("random");
  const [hover, setHover] = useState<{ i: number; method: "iter" | "e2e" } | null>(null);

  const v = VIEWS[view];
  const data = v.data;
  const groupW = innerW / data.length;
  const barW = (groupW - 18) / 2;
  const yOf = (val: number) => pad.t + (1 - val / v.yMax) * innerH;

  // Make tick marks responsive to yMax
  const ticks = view === "random" ? [0, 50, 100, 150, 200] : [0, 200, 400, 600];

  return (
    <div className="relative w-full">
      {/* Toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(Object.keys(VIEWS) as ViewKey[]).map((k) => {
          const on = view === k;
          return (
            <button
              key={k}
              onClick={() => { setView(k); setHover(null); }}
              data-cursor-hover
              className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 border-[1.5px] transition-colors duration-150"
              style={{
                background: on ? "var(--color-text)" : "var(--color-bg)",
                color: on ? "var(--color-bg)" : "var(--color-text)",
                borderColor: "var(--color-text)",
              }}
            >
              {VIEWS[k].label}
            </button>
          );
        })}
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] ml-1">
          {v.sub}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Cascade per ablation layer">
        {ticks.map((val) => (
          <g key={val}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(val)} y2={yOf(val)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={yOf(val) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{val}</text>
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-text)" strokeWidth="1" />

        {data.map((d, i) => {
          const cx = pad.l + groupW * i + groupW / 2;
          const iX = cx - barW - 3;
          const eX = cx + 3;
          const iTop = yOf(d.iter);
          const eTop = yOf(d.e2e);
          const dim = (m: "iter" | "e2e") => hover && (hover.i !== i || hover.method !== m) ? 0.35 : 1;
          return (
            <g key={i}>
              <rect x={iX} y={iTop} width={barW} height={H - pad.b - iTop} fill="var(--color-blue)" stroke="var(--color-text)" strokeWidth="1.25"
                opacity={dim("iter")}
                onMouseEnter={() => setHover({ i, method: "iter" })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
              <rect x={eX} y={eTop} width={barW} height={H - pad.b - eTop} fill="var(--color-pink)" stroke="var(--color-text)" strokeWidth="1.25"
                opacity={dim("e2e")}
                onMouseEnter={() => setHover({ i, method: "e2e" })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
              <text x={cx} y={H - pad.b + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)">L{d.layer}</text>
              <text x={iX + barW / 2} y={iTop - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="var(--color-blue)">{d.iter.toFixed(0)}</text>
              <text x={eX + barW / 2} y={eTop - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="var(--color-pink)">{d.e2e.toFixed(0)}</text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${pad.l}, 16)`}>
          <rect x="0" y="0" width="11" height="11" fill="var(--color-blue)" stroke="var(--color-text)" strokeWidth="1" />
          <text x="16" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.1em">ITERATIVE</text>
          <rect x="100" y="0" width="11" height="11" fill="var(--color-pink)" stroke="var(--color-text)" strokeWidth="1" />
          <text x="116" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.1em">E2E</text>
          <text x="180" y="10" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)" letterSpacing="0.08em">
            grand mean: {v.grand.iter} vs {v.grand.e2e} ({v.ratio})
          </text>
        </g>

        {/* axis labels */}
        <text x={pad.l + innerW / 2} y={H - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em">ABLATION LAYER</text>
        <text x={14} y={pad.t + innerH / 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" letterSpacing="0.15em" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>MEAN DOWNSTREAM CASCADE</text>
      </svg>
      {hover && (
        <div
          className="absolute font-mono text-[11px] font-bold bg-[var(--color-text)] text-[var(--color-bg)] px-2 py-1 pointer-events-none"
          style={{
            left: `${((pad.l + groupW * hover.i + groupW / 2) / W) * 100}%`,
            top: `${(yOf(hover.method === "iter" ? data[hover.i].iter : data[hover.i].e2e) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            whiteSpace: "nowrap",
          }}
        >
          {hover.method === "iter" ? "Iter" : "E2E"} L{data[hover.i].layer} / {(hover.method === "iter" ? data[hover.i].iter : data[hover.i].e2e).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default CascadeChart;
