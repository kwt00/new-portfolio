import { useEffect, useRef, useState } from "react";

/**
 * ArchitectureDiagram - clean top-to-bottom schematic of one routed
 * transformer block. Two parallel columns (router path on the left,
 * attention path on the right) merge into the directional-suppression
 * box, then the standard W_out + MLP path closes out.
 */

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  color?: string;
  textColor?: string;
}

const Box = ({ x, y, w, h, label, sublabel, color = "var(--color-bg)", textColor = "var(--color-text)" }: BoxProps) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect
      x={0}
      y={0}
      width={w}
      height={h}
      fill={color}
      stroke="var(--color-text)"
      strokeWidth={2}
    />
    <text
      x={w / 2}
      y={sublabel ? h / 2 - 6 : h / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="'Space Mono', monospace"
      fontSize={11}
      fontWeight={700}
      fill={textColor}
      style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
    >
      {label}
    </text>
    {sublabel && (
      <text
        x={w / 2}
        y={h / 2 + 9}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Space Mono', monospace"
        fontSize={9}
        fill={textColor}
        opacity={0.75}
      >
        {sublabel}
      </text>
    )}
  </g>
);

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dashed?: boolean;
}

const Arrow = ({ x1, y1, x2, y2, color = "var(--color-text)", dashed }: ArrowProps) => {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  const headW = 5;
  const tx = x2 - Math.cos(ang) * headLen;
  const ty = y2 - Math.sin(ang) * headLen;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth={1.75}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${tx - Math.sin(ang) * headW},${ty + Math.cos(ang) * headW} ${tx + Math.sin(ang) * headW},${ty - Math.cos(ang) * headW}`}
        fill={color}
      />
    </g>
  );
};

const ArchitectureDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.55) / (window.innerHeight * 0.3)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Layout constants - top-to-bottom, two parallel columns merge into suppression
  const W = 720;
  const H = 620;

  // Column x-centers
  const cxLeft = 180;
  const cxRight = 540;
  const cxMid = 360;

  // Box dimensions
  const bw = 220; // box width for column boxes
  const bh = 50;  // box height for column boxes
  const bwWide = 380; // wide box for suppression and merge nodes

  // Y positions
  const y0 = 30;   // residual in
  const y1 = 110;  // mean-pool / standard attn
  const y2 = 195;  // router / head outputs
  const y3 = 280;  // routing weights / (head outputs)
  const y4 = 380;  // directional suppression
  const y5 = 480;  // w_out + mlp + residual
  const y6 = 565;  // residual out

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ maxHeight: 640, opacity: Math.min(1, progress * 2) }}
      >
        {/* TOP: residual in */}
        <Box x={cxMid - bw / 2} y={y0} w={bw} h={36} label="RESIDUAL STREAM IN" sublabel="(B, T, 1536)" />

        {/* Branch arrows */}
        <Arrow x1={cxMid - 50} y1={y0 + 36} x2={cxLeft + 30} y2={y1} />
        <Arrow x1={cxMid + 50} y1={y0 + 36} x2={cxRight - 30} y2={y1} />

        {/* LEFT COLUMN: router path */}
        <Box x={cxLeft - bw / 2} y={y1} w={bw} h={bh} label="MEAN-POOL" sublabel="seq dim → (B, 1536)" color="var(--color-pink)" textColor="white" />
        <Arrow x1={cxLeft} y1={y1 + bh} x2={cxLeft} y2={y2} />
        <Box x={cxLeft - bw / 2} y={y2} w={bw} h={bh} label="ROUTER MLP" sublabel="1536 → 512×3 → 48" color="var(--color-pink)" textColor="white" />
        <Arrow x1={cxLeft} y1={y2 + bh} x2={cxLeft} y2={y3} />
        <Box x={cxLeft - bw / 2} y={y3} w={bw} h={bh} label="ROUTING WEIGHTS" sublabel="r ∈ [0,1]^{12 × 4}" color="var(--color-violet)" textColor="white" />

        {/* RIGHT COLUMN: attention path */}
        <Box x={cxRight - bw / 2} y={y1} w={bw} h={bh} label="STANDARD ATTN" sublabel="Q · K, scaled dot-product" />
        <Arrow x1={cxRight} y1={y1 + bh} x2={cxRight} y2={y2} />
        <Box x={cxRight - bw / 2} y={y2} w={bw} h={bh} label="HEAD OUTPUTS" sublabel="o_h ∈ R^128, ×12 heads" />
        <Arrow x1={cxRight} y1={y2 + bh} x2={cxRight} y2={y3} />
        {/* invisible spacer to keep symmetry - instead just continue to suppression */}

        {/* Merge into directional suppression */}
        <Arrow x1={cxLeft} y1={y3 + bh} x2={cxMid - bwWide / 2 + 60} y2={y4} dashed color="var(--color-violet)" />
        <Arrow x1={cxRight} y1={y3 + bh - 6} x2={cxMid + bwWide / 2 - 60} y2={y4} />
        <Box x={cxMid - bwWide / 2} y={y4} w={bwWide} h={66} label="DIRECTIONAL SUPPRESSION" sublabel="o' = o − Σ r·(o·d)·d" color="var(--color-orange)" textColor="white" />

        {/* Down to W_out + MLP + residual */}
        <Arrow x1={cxMid} y1={y4 + 66} x2={cxMid} y2={y5} />
        <Box x={cxMid - bw / 2} y={y5} w={bw} h={bh} label="W_OUT + MLP + RESIDUAL" sublabel="(no routing on MLP)" />
        <Arrow x1={cxMid} y1={y5 + bh} x2={cxMid} y2={y6} />

        {/* Bottom: residual out */}
        <Box x={cxMid - bw / 2} y={y6} w={bw} h={36} label="TO NEXT LAYER" sublabel="(B, T, 1536)" />
      </svg>
    </div>
  );
};

export default ArchitectureDiagram;
