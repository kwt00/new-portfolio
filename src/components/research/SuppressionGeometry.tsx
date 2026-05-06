import { useEffect, useRef, useState } from "react";

/**
 * SuppressionGeometry — 2D simplified visualization of the suppression
 * operation. Shows a head's output vector being projected onto a learned
 * direction and that projected component being subtracted (scaled by
 * routing weight).
 *
 * Real space is 128-dim; this collapses to 2D for intuition.
 */

const SuppressionGeometry = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [routingWeight, setRoutingWeight] = useState(0.7); // user-controllable

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.55) / (window.innerHeight * 0.35)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2D coordinates centered at (200, 180), 1 unit = 80 px
  const cx = 220;
  const cy = 200;
  const u = 80;

  // Head output vector: 1.6, 1.0  (in 2D for illustration)
  const ox = 1.6;
  const oy = 1.0;

  // Direction vector d (unit-norm in 2D for illustration)
  const dxRaw = 1.0;
  const dyRaw = 0.0;
  const dnorm = Math.sqrt(dxRaw * dxRaw + dyRaw * dyRaw);
  const dx = dxRaw / dnorm;
  const dy = dyRaw / dnorm;

  // Projection scalar: o · d
  const projScalar = ox * dx + oy * dy;

  // Component to remove: r * proj * d
  const removeX = routingWeight * projScalar * dx;
  const removeY = routingWeight * projScalar * dy;

  // Suppressed output
  const oxNew = ox - removeX;
  const oyNew = oy - removeY;

  // To screen coords (y inverted)
  const px = (x: number) => cx + x * u;
  const py = (y: number) => cy - y * u;

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] p-5"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">
          Suppression operation (2D simplification)
        </div>
        <div className="font-mono text-[11px] font-bold text-[var(--color-text)] mb-4">
          o' = o − r · (o · d) · d
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <svg viewBox="0 0 440 360" className="w-full h-auto" style={{ maxHeight: 360, opacity: Math.min(1, progress * 2) }}>
            {/* Axes */}
            <line x1={20} y1={cy} x2={420} y2={cy} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={cx} y1={20} x2={cx} y2={340} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="3 3" />

            {/* Direction d (extends in both directions, dimmed) */}
            <line
              x1={px(-2.4)}
              y1={py(-2.4 * dy)}
              x2={px(2.4)}
              y2={py(2.4 * dy)}
              stroke="var(--color-pink)"
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.5}
            />

            {/* Direction d as arrow */}
            <line x1={cx} y1={cy} x2={px(dx * 1.0)} y2={py(dy * 1.0)} stroke="var(--color-pink)" strokeWidth={2.5} />
            <polygon
              points={`${px(dx * 1.0)},${py(dy * 1.0)} ${px(dx * 1.0) - 8},${py(dy * 1.0) - 5} ${px(dx * 1.0) - 8},${py(dy * 1.0) + 5}`}
              fill="var(--color-pink)"
            />
            <text x={px(1.0) + 14} y={py(0) + 4} fontFamily="'Space Mono', monospace" fontSize={11} fontWeight={700} fill="var(--color-pink)">d (direction)</text>

            {/* Projection of o onto d (drop perpendicular) */}
            <line
              x1={px(ox)}
              y1={py(oy)}
              x2={px(projScalar * dx)}
              y2={py(projScalar * dy)}
              stroke="var(--color-text-muted)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />

            {/* Component to remove (scaled by r) */}
            <line
              x1={cx}
              y1={cy}
              x2={px(removeX)}
              y2={py(removeY)}
              stroke="var(--color-orange)"
              strokeWidth={4}
            />
            <text x={px(removeX / 2) - 16} y={py(removeY) - 12} fontFamily="'Space Mono', monospace" fontSize={10} fontWeight={700} fill="var(--color-orange)">
              r · (o·d) · d
            </text>

            {/* Original head output o */}
            <line x1={cx} y1={cy} x2={px(ox)} y2={py(oy)} stroke="var(--color-blue)" strokeWidth={2.5} />
            <polygon
              points={`${px(ox)},${py(oy)} ${px(ox) - 8 * Math.cos(Math.atan2(-oy, ox))},${py(oy) - 8 * Math.sin(Math.atan2(-oy, ox))}`}
              fill="var(--color-blue)"
            />
            <circle cx={px(ox)} cy={py(oy)} r={4} fill="var(--color-blue)" />
            <text x={px(ox) + 8} y={py(oy) - 8} fontFamily="'Space Mono', monospace" fontSize={11} fontWeight={700} fill="var(--color-blue)">o (head out)</text>

            {/* New suppressed output o' */}
            <line x1={cx} y1={cy} x2={px(oxNew)} y2={py(oyNew)} stroke="var(--color-violet)" strokeWidth={2.5} strokeDasharray="0" />
            <circle cx={px(oxNew)} cy={py(oyNew)} r={4} fill="var(--color-violet)" />
            <text x={px(oxNew) + 8} y={py(oyNew) + 16} fontFamily="'Space Mono', monospace" fontSize={11} fontWeight={700} fill="var(--color-violet)">o' (after suppression)</text>

            {/* Origin label */}
            <text x={cx - 14} y={cy + 14} fontFamily="'Space Mono', monospace" fontSize={9} fill="var(--color-text-muted)">0</text>
          </svg>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {/* Routing weight slider */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Routing weight r
                </span>
                <span className="font-mono text-[12px] font-bold text-[var(--color-orange)]">
                  {routingWeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={routingWeight}
                onChange={(e) => setRoutingWeight(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--color-orange)" }}
              />
              <div className="flex justify-between font-mono text-[8px] text-[var(--color-text-muted)] mt-1 uppercase tracking-[0.1em]">
                <span>0 (no suppress)</span>
                <span>1 (full suppress)</span>
              </div>
            </div>

            {/* Component breakdown */}
            <div className="border-[2px] border-[var(--color-text)] bg-[var(--color-bg)] p-2 font-mono text-[10px]">
              <div className="flex justify-between"><span>o · d</span><span>{projScalar.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>removed</span><span style={{ color: "var(--color-orange)" }}>{routingWeight * projScalar > 0 ? "−" : "+"}{(routingWeight * projScalar).toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-[var(--color-border)] mt-1 pt-1"><span>o' magnitude</span><span style={{ color: "var(--color-violet)" }}>{Math.sqrt(oxNew * oxNew + oyNew * oyNew).toFixed(2)}</span></div>
            </div>

            <div className="font-serif italic text-[11px] leading-[1.5] text-[var(--color-text-muted)]">
              Drag the slider. r=0 leaves o untouched. r=1 fully removes the
              component along d. Everything orthogonal to d passes through.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppressionGeometry;
