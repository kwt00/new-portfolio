import { useState } from "react";

type Cat = "frozen" | "trainable" | "data" | "loss";

const CAT_FILL: Record<Cat, string> = {
  frozen: "var(--color-blue)",
  trainable: "var(--color-teal)",
  data: "var(--color-text-muted)",
  loss: "var(--color-orange)",
};

const W = 760, H = 460;

interface BoxDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  cat: Cat;
}

// Top chain: 10 slots
const yChain = 80;
const cw = 64, ch = 42, gap = 13;
const chainStart = 14;
const xs = (i: number) => chainStart + i * (cw + gap);

const chain: BoxDef[] = [
  { id: "tok", x: xs(0), y: yChain, w: cw, h: ch, label: "Tokens", cat: "data" },
  { id: "a0",  x: xs(1), y: yChain, w: cw, h: ch, label: "Attn 0", cat: "frozen" },
  { id: "t0",  x: xs(2), y: yChain, w: cw, h: ch, label: "Trans 0", cat: "trainable" },
  { id: "a1",  x: xs(3), y: yChain, w: cw, h: ch, label: "Attn 1", cat: "frozen" },
  { id: "t1",  x: xs(4), y: yChain, w: cw, h: ch, label: "Trans 1", cat: "trainable" },
  { id: "a11", x: xs(6), y: yChain, w: cw, h: ch, label: "Attn 11", cat: "frozen" },
  { id: "t11", x: xs(7), y: yChain, w: cw, h: ch, label: "Trans 11", cat: "trainable" },
  { id: "lm",  x: xs(8), y: yChain, w: cw, h: ch, label: "LM Head", cat: "frozen" },
  { id: "log", x: xs(9), y: yChain, w: cw, h: ch, label: "Logits", cat: "data" },
];

const trans = chain.filter((b) => b.cat === "trainable");

const lossX = W / 2 - 70, lossY = 240, lossW = 140, lossH = 44;
const tgtX = W / 2 - 90, tgtY = 340, tgtW = 180, tgtH = 50;

const E2EDiagram = () => {
  const [hov, setHov] = useState<Cat | null>(null);

  const dim = (cat: Cat) => (hov && hov !== cat ? 0.3 : 1);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="End-to-end joint training schematic">
        <defs>
          <marker id="arrFwd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text)" />
          </marker>
          <marker id="arrBack" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-pink)" />
          </marker>
        </defs>

        {/* title */}
        <text x={W / 2} y={32} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill="var(--color-text)" letterSpacing="0.18em">
          E2E JOINT TRAINING / ONE STEP
        </text>

        {/* chain forward arrows between boxes */}
        {chain.slice(0, -1).map((b, i) => {
          const next = chain[i + 1];
          return (
            <line key={`arr-${i}`} x1={b.x + b.w} y1={b.y + b.h / 2} x2={next.x - 1} y2={next.y + next.h / 2} stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" />
          );
        })}

        {/* ellipsis at slot 5 */}
        <text x={xs(5) + cw / 2} y={yChain + ch / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fill="var(--color-text-muted)">. . .</text>

        {/* boxes */}
        {chain.map((b) => (
          <g key={b.id} opacity={dim(b.cat)} onMouseEnter={() => setHov(b.cat)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer", transition: "opacity 0.2s" }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={CAT_FILL[b.cat]} fillOpacity="0.28" stroke="var(--color-text)" strokeWidth="1.5" />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--color-text)">{b.label}</text>
          </g>
        ))}

        {/* Logits down to Loss (forward) */}
        <path d={`M ${chain[chain.length-1].x + chain[chain.length-1].w/2} ${yChain + ch} L ${chain[chain.length-1].x + chain[chain.length-1].w/2} ${lossY + lossH/2} L ${lossX + lossW + 1} ${lossY + lossH/2}`} fill="none" stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" />

        {/* Target Logits → Loss */}
        <line x1={tgtX + tgtW/2} y1={tgtY} x2={tgtX + tgtW/2} y2={lossY + lossH + 1} stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" transform={`scale(1, -1) translate(0, -${tgtY + lossY + lossH + 1})`} />
        {/* simpler: arrow upward */}
        <line x1={tgtX + tgtW/2} y1={tgtY - 1} x2={tgtX + tgtW/2} y2={lossY + lossH + 6} stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" />

        {/* Loss → each trainable transcoder (backward, dashed red) */}
        {trans.map((t) => (
          <path
            key={`back-${t.id}`}
            d={`M ${lossX + lossW/2} ${lossY} C ${lossX + lossW/2} ${(yChain + ch + lossY) / 2}, ${t.x + t.w/2} ${(yChain + ch + lossY) / 2}, ${t.x + t.w/2} ${yChain + ch + 1}`}
            fill="none"
            stroke="var(--color-pink)"
            strokeWidth="1.1"
            strokeDasharray="3 3"
            markerEnd="url(#arrBack)"
            opacity={hov === "trainable" || hov === "loss" ? 1 : hov ? 0.3 : 0.85}
          />
        ))}

        {/* Loss box */}
        <g opacity={dim("loss")} onMouseEnter={() => setHov("loss")} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer", transition: "opacity 0.2s" }}>
          <rect x={lossX} y={lossY} width={lossW} height={lossH} fill={CAT_FILL.loss} fillOpacity="0.32" stroke="var(--color-text)" strokeWidth="1.5" />
          <text x={lossX + lossW/2} y={lossY + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)">Loss</text>
          <text x={lossX + lossW/2} y={lossY + 33} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">KL DIVERGENCE</text>
        </g>

        {/* Target Logits */}
        <g opacity={dim("data")} onMouseEnter={() => setHov("data")} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer", transition: "opacity 0.2s" }}>
          <rect x={tgtX} y={tgtY} width={tgtW} height={tgtH} fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={tgtX + tgtW/2} y={tgtY + 19} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--color-text)">Target Logits</text>
          <text x={tgtX + tgtW/2} y={tgtY + 36} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">FROM ORIGINAL GPT-2</text>
        </g>

        {/* Legend */}
        <g transform="translate(20, 415)">
          {[
            { c: "frozen" as const, label: "Frozen (GPT-2)" },
            { c: "trainable" as const, label: "Trainable (Transcoder)" },
            { c: "loss" as const, label: "Loss" },
          ].map((l, i) => (
            <g key={l.c} transform={`translate(${i * 175}, 0)`} onMouseEnter={() => setHov(l.c)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }} opacity={hov && hov !== l.c ? 0.45 : 1}>
              <rect x="0" y="0" width="14" height="11" fill={CAT_FILL[l.c]} fillOpacity="0.28" stroke="var(--color-text)" strokeWidth="1.25" />
              <text x="20" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.08em">{l.label.toUpperCase()}</text>
            </g>
          ))}
          <g transform="translate(525, 0)">
            <line x1="0" y1="6" x2="20" y2="6" stroke="var(--color-text)" strokeWidth="1.25" markerEnd="url(#arrFwd)" />
            <text x="26" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.08em">FORWARD</text>
          </g>
          <g transform="translate(625, 0)">
            <line x1="0" y1="6" x2="20" y2="6" stroke="var(--color-pink)" strokeWidth="1.1" strokeDasharray="3 3" markerEnd="url(#arrBack)" />
            <text x="26" y="10" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)" letterSpacing="0.08em">GRADIENT</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default E2EDiagram;
