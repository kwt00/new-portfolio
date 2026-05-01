import { useState } from "react";

type Cat = "attn" | "trainable" | "frozen" | "real" | "data" | "info";

const FILL: Record<Cat, string> = {
  attn: "var(--color-blue)",
  trainable: "var(--color-teal)",
  frozen: "var(--color-violet)",
  real: "var(--color-text-muted)",
  data: "var(--color-bg-secondary)",
  info: "var(--color-orange)",
};

const W = 780, H = 640;

interface Cell {
  label: string;
  sub?: string;
  cat: Cat;
}

// Chain spec for each round (9 visible items + ellipsis between slots 4 and 5)
const r1Chain: Cell[] = [
  { label: "Tokens", cat: "data" },
  { label: "Attn 0", cat: "attn" },
  { label: "MLP 0", sub: "real", cat: "real" },
  { label: "Attn 1", cat: "attn" },
  { label: "Trans 1", sub: "frozen", cat: "frozen" },
  { label: "Attn 11", cat: "attn" },
  { label: "Trans 11", sub: "frozen", cat: "frozen" },
  { label: "LM Head", cat: "attn" },
];

const r2Chain: Cell[] = [
  { label: "Tokens", cat: "data" },
  { label: "Attn 0", cat: "attn" },
  { label: "Trans 0", sub: "frozen", cat: "frozen" },
  { label: "Attn 1", cat: "attn" },
  { label: "MLP 1", sub: "real", cat: "real" },
  { label: "Attn 11", cat: "attn" },
  { label: "MLP 11", sub: "real", cat: "real" },
  { label: "LM Head", cat: "attn" },
];

const cw = 70, ch = 44, gap = 14;
const chainW = r1Chain.length * cw + (r1Chain.length - 1) * gap + cw + gap; // include ellipsis slot
const chainStart = (W - chainW) / 2;
const xs = (i: number) => {
  // slot 5 reserved for ellipsis between item index 4 and 5
  const offset = i >= 5 ? 1 : 0;
  return chainStart + (i + offset) * (cw + gap);
};

const Chain = ({
  yTop,
  cells,
  trainSet,
  hov,
  setHov,
}: {
  yTop: number;
  cells: Cell[];
  trainSet: number[];
  hov: Cat | null;
  setHov: (c: Cat | null) => void;
}) => {
  const yMid = yTop + ch / 2;
  return (
    <>
      {/* connecting arrows */}
      {cells.slice(0, -1).map((_, i) => (
        <line
          key={`arr-${i}`}
          x1={xs(i) + cw}
          y1={yMid}
          x2={xs(i + 1) - 1}
          y2={yMid}
          stroke="var(--color-text)"
          strokeWidth="1.1"
          markerEnd="url(#arrFwd)"
        />
      ))}
      {/* ellipsis */}
      <text
        x={xs(4) + cw + gap + cw / 2}
        y={yMid + 4}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="14"
        fill="var(--color-text-muted)"
      >. . .</text>

      {cells.map((c, i) => {
        const isTraining = trainSet.includes(i);
        const cat: Cat = isTraining ? "trainable" : c.cat;
        const dim = hov && hov !== cat ? 0.3 : 1;
        return (
          <g
            key={i}
            opacity={dim}
            onMouseEnter={() => setHov(cat)}
            onMouseLeave={() => setHov(null)}
            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
          >
            <rect
              x={xs(i)}
              y={yTop}
              width={cw}
              height={ch}
              fill={FILL[cat]}
              fillOpacity="0.28"
              stroke="var(--color-text)"
              strokeWidth={isTraining ? 2 : 1.5}
            />
            <text x={xs(i) + cw / 2} y={yMid - (c.sub ? 1 : -4)} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">
              {c.label}
            </text>
            {c.sub && (
              <text x={xs(i) + cw / 2} y={yMid + 12} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--color-text-muted)">
                {c.sub}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
};

const IterativeDiagram = () => {
  const [hov, setHov] = useState<Cat | null>(null);

  // For Round 1, we're "training even transcoders" — but in the simplified chain we
  // show MLP 0 (real) and Trans 1 (frozen). The training arrow points to even
  // transcoders abstractly. To still convey this visually, mark "MLP 0" position
  // with a "→ replaces with new even transcoder" arrow below.
  // Simpler: highlight no chain cell as "trainable" (we don't render the trainable
  // even transcoder INSIDE the run — the run uses real MLPs to gather data).
  // The training step is the box BELOW the chain.

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Iterative alternating training schematic">
        <defs>
          <marker id="arrFwd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text)" />
          </marker>
          <marker id="arrTrain" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-orange)" />
          </marker>
        </defs>

        {/* title */}
        <text x={W / 2} y={28} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill="var(--color-text)" letterSpacing="0.18em">
          ITERATIVE ALTERNATING TRAINING
        </text>

        {/* === STEP 1 PANEL === */}
        <rect x={20} y={48} width={W - 40} height={108} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={36} y={68} fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)" letterSpacing="0.15em">STEP 1 / COLLECT  (~2 MIN)</text>

        {/* GPT-2 box */}
        <g opacity={hov && hov !== "data" ? 0.3 : 1} onMouseEnter={() => setHov("data")} onMouseLeave={() => setHov(null)}>
          <rect x={50} y={88} width={130} height={48} fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth="1.5" />
          <text x={115} y={108} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)">Original GPT-2</text>
          <text x={115} y={124} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">FROZEN</text>
        </g>

        {/* arrow */}
        <line x1={186} y1={112} x2={224} y2={112} stroke="var(--color-text)" strokeWidth="1.1" markerEnd="url(#arrFwd)" />

        {/* 12 cylinder data nodes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 234 + i * 38;
          return (
            <g key={i} opacity={hov && hov !== "data" ? 0.3 : 1} onMouseEnter={() => setHov("data")} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
              <ellipse cx={cx + 14} cy={94} rx="14" ry="4" fill={FILL.data} stroke="var(--color-text)" strokeWidth="1" />
              <rect x={cx} y={94} width={28} height={28} fill={FILL.data} stroke="var(--color-text)" strokeWidth="1" />
              <ellipse cx={cx + 14} cy={122} rx="14" ry="4" fill={FILL.data} stroke="var(--color-text)" strokeWidth="1" />
              <text x={cx + 14} y={108} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="var(--color-text)">L{i}</text>
            </g>
          );
        })}
        <text x={W - 40} y={146} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fontStyle="italic" fill="var(--color-text-muted)">cached (input, output) pairs per layer</text>

        {/* arrow down */}
        <line x1={W / 2} y1={170} x2={W / 2} y2={188} stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" />

        {/* === ROUND 1 PANEL === */}
        <rect x={20} y={196} width={W - 40} height={188} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={36} y={216} fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)" letterSpacing="0.15em">
          ROUND 1 / RUN HYBRID, TRAIN <tspan fill="var(--color-teal)">EVEN</tspan> TRANSCODERS  (~12 MIN)
        </text>

        <Chain yTop={236} cells={r1Chain} trainSet={[]} hov={hov} setHov={setHov} />

        {/* training callout */}
        <g opacity={hov && hov !== "trainable" && hov !== "info" ? 0.3 : 1} onMouseEnter={() => setHov("trainable")} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
          <line x1={W / 2} y1={282} x2={W / 2} y2={310} stroke="var(--color-orange)" strokeWidth="1.25" strokeDasharray="3 3" markerEnd="url(#arrTrain)" />
          <rect x={W / 2 - 220} y={314} width={440} height={56} fill={FILL.info} fillOpacity="0.22" stroke="var(--color-text)" strokeWidth="1.5" />
          <text x={W / 2} y={336} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">
            Record (shifted-input, real-MLP-output) for even layers
          </text>
          <text x={W / 2} y={354} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-teal)">
            MSE-train EVEN transcoders {`{0, 2, 4, 6, 8, 10}`}
          </text>
        </g>

        {/* arrow down to round 2 with "swap roles" */}
        <line x1={W / 2} y1={386} x2={W / 2} y2={416} stroke="var(--color-text)" strokeWidth="1.25" strokeDasharray="2 4" markerEnd="url(#arrFwd)" />
        <text x={W / 2 + 12} y={404} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)" letterSpacing="0.1em">SWAP ROLES</text>

        {/* === ROUND 2 PANEL === */}
        <rect x={20} y={424} width={W - 40} height={188} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={36} y={444} fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)" letterSpacing="0.15em">
          ROUND 2 / RUN HYBRID, TRAIN <tspan fill="var(--color-teal)">ODD</tspan> TRANSCODERS  (~12 MIN)
        </text>

        <Chain yTop={464} cells={r2Chain} trainSet={[]} hov={hov} setHov={setHov} />

        <g opacity={hov && hov !== "trainable" && hov !== "info" ? 0.3 : 1} onMouseEnter={() => setHov("trainable")} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
          <line x1={W / 2} y1={510} x2={W / 2} y2={538} stroke="var(--color-orange)" strokeWidth="1.25" strokeDasharray="3 3" markerEnd="url(#arrTrain)" />
          <rect x={W / 2 - 220} y={542} width={440} height={56} fill={FILL.info} fillOpacity="0.22" stroke="var(--color-text)" strokeWidth="1.5" />
          <text x={W / 2} y={564} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">
            Record (shifted-input, real-MLP-output) for odd layers
          </text>
          <text x={W / 2} y={582} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-teal)">
            MSE-train ODD transcoders {`{1, 3, 5, 7, 9, 11}`}
          </text>
        </g>

        {/* convergence note */}
        <text x={W / 2} y={628} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontStyle="italic" fill="var(--color-text-muted)">
          repeat as needed. delta-KL drops below 0.015 after two rounds.
        </text>
      </svg>

      {/* Legend strip below the SVG (clickable categories) */}
      <div className="mt-5 pt-4 border-t-[1px] border-[var(--color-border)] flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {([
          { c: "attn", l: "Frozen attn" },
          { c: "real", l: "Real MLP" },
          { c: "frozen", l: "Frozen transcoder" },
          { c: "trainable", l: "Trainable transcoder" },
          { c: "data", l: "Cached data" },
          { c: "info", l: "Loss / training" },
        ] as { c: Cat; l: string }[]).map((item) => (
          <button
            key={item.c}
            onMouseEnter={() => setHov(item.c)}
            onMouseLeave={() => setHov(null)}
            className="inline-flex items-center gap-2 transition-opacity"
            style={{ opacity: hov && hov !== item.c ? 0.4 : 1 }}
            data-cursor-hover
          >
            <span
              className="inline-block w-3 h-3 border-[1px] border-[var(--color-text)]"
              style={{ background: FILL[item.c], opacity: 0.45 }}
            />
            {item.l}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IterativeDiagram;
