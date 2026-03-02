import { useRef, useEffect, useState, useCallback } from "react";

/**
 * Animated Training Curve — scroll-triggered line chart.
 * Zoomed into the 10–50 PPL range where the gap between
 * Baseline and Routed is clearly visible.
 *
 * Data from the directional routing paper (400M scale).
 */

// Actual data points — only the region where gap matters
const STEPS =    [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
const BASELINE = [43,   35,   29,   25,   22,   20,   18.5, 17.5, 17,   16.3];
const ROUTED =   [42,   32,   27,   23,   20,   16.5, 15,   14,   13.2, 12.6];

const PAD = { top: 30, right: 24, bottom: 44, left: 48 };

const TrainingCurve = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.5) / (window.innerHeight * 0.35)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cw = w - PAD.left - PAD.right;
    const ch = h - PAD.top - PAD.bottom;

    // Zoomed scale — 10 to 48 PPL
    const yMin = 10;
    const yMax = 48;
    const xMin = 1500;
    const xMax = 6000;
    const toX = (v: number) => PAD.left + ((v - xMin) / (xMax - xMin)) * cw;
    const toY = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * ch;

    ctx.clearRect(0, 0, w, h);

    // Get computed colors
    const root = document.documentElement;
    const textMuted = getComputedStyle(root).getPropertyValue("--color-text-muted").trim() || "#7a6f62";
    const textColor = getComputedStyle(root).getPropertyValue("--color-text").trim() || "#1a1613";

    // Grid
    ctx.strokeStyle = "rgba(184, 171, 156, 0.25)";
    ctx.lineWidth = 1;
    for (let y = 10; y <= 45; y += 5) {
      ctx.beginPath();
      ctx.moveTo(PAD.left, toY(y));
      ctx.lineTo(w - PAD.right, toY(y));
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = textMuted;
    ctx.font = "bold 10px 'Space Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let y = 10; y <= 45; y += 10) {
      ctx.fillText(y.toString(), PAD.left - 8, toY(y));
    }

    // X labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i < STEPS.length; i += 2) {
      ctx.fillText(STEPS[i].toString(), toX(STEPS[i]), toY(yMin) + 8);
    }

    // Axis titles
    ctx.fillText("STEP", w / 2, h - 8);
    ctx.save();
    ctx.translate(10, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("PPL", 0, 0);
    ctx.restore();

    // Baseline final dashed line
    ctx.strokeStyle = "rgba(74, 126, 245, 0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD.left, toY(16.3));
    ctx.lineTo(w - PAD.right, toY(16.3));
    ctx.stroke();
    ctx.setLineDash([]);

    // Visible points
    const vis = Math.ceil(progress * STEPS.length);

    // Shade the gap between curves
    if (vis > 1) {
      ctx.beginPath();
      for (let i = 0; i < vis && i < STEPS.length; i++) {
        const x = toX(STEPS[i]);
        const y = toY(BASELINE[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = Math.min(vis, STEPS.length) - 1; i >= 0; i--) {
        ctx.lineTo(toX(STEPS[i]), toY(ROUTED[i]));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(232, 93, 117, 0.08)";
      ctx.fill();
    }

    // Draw line helper
    const drawLine = (data: number[], color: string, shadow: string) => {
      if (vis < 1) return;

      // Shadow
      ctx.strokeStyle = shadow;
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < vis && i < data.length; i++) {
        const x = toX(STEPS[i]) + 2;
        const y = toY(data[i]) + 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Main
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < vis && i < data.length; i++) {
        const x = toX(STEPS[i]);
        const y = toY(data[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Points
      for (let i = 0; i < vis && i < data.length; i++) {
        const x = toX(STEPS[i]);
        const y = toY(data[i]);
        const isH = hoverIndex === i;
        const s = isH ? 8 : 5;
        ctx.fillStyle = shadow;
        ctx.fillRect(x - s / 2 + 2, y - s / 2 + 2, s, s);
        ctx.fillStyle = color;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - s / 2, y - s / 2, s, s);
      }
    };

    drawLine(BASELINE, "#4a7ef5", "rgba(74, 126, 245, 0.2)");
    drawLine(ROUTED, "#e85d75", "rgba(232, 93, 117, 0.2)");

  }, [progress, hoverIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const cw = rect.width - PAD.left - PAD.right;
    const relX = (mx - PAD.left) / cw;
    const idx = Math.round(relX * (STEPS.length - 1));
    setHoverIndex(idx >= 0 && idx < STEPS.length ? idx : null);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex items-center gap-5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[var(--color-blue)] border-[2px] border-[var(--color-text)]" />
          <span className="text-[10px] font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
            Baseline (417M)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[var(--color-pink)] border-[2px] border-[var(--color-text)]" />
          <span className="text-[10px] font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
            Routed (433M)
          </span>
        </div>
      </div>
      <div
        className="relative border-[4px] border-[var(--color-text)] bg-[var(--color-surface)]"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 220, display: "block" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        />
        {hoverIndex !== null && (
          <div
            className="absolute pointer-events-none px-3 py-2 bg-[var(--color-text)] text-[var(--color-bg)] text-[11px] font-mono font-bold z-30"
            style={{
              left: Math.min(mousePos.x + 12, 280),
              top: mousePos.y - 50,
              boxShadow: "3px 3px 0px var(--color-text-muted)",
            }}
          >
            <div>Step {STEPS[hoverIndex]}</div>
            <div className="text-[#4a7ef5]">Baseline: {BASELINE[hoverIndex]} PPL</div>
            <div className="text-[#e85d75]">Routed: {ROUTED[hoverIndex]} PPL</div>
            <div className="text-[var(--color-teal)] mt-1">
              Δ {(BASELINE[hoverIndex] - ROUTED[hoverIndex]).toFixed(1)} PPL better
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCurve;
