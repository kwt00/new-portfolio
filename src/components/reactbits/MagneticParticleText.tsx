import { useEffect, useRef, useCallback } from "react";

interface MagneticParticleTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  particleDensity?: number;
  colors?: string[];
  mouseRadius?: number;
  mouseForce?: number;
  springStiffness?: number;
  damping?: number;
  noiseAmount?: number;
  particleSize?: number;
}

/**
 * MagneticParticleText — high-perf variant.
 *
 * Renders text as particles with spring physics + cursor repulsion.
 * Optimised: capped DPR, wider sampling gap, no per-particle save/restore,
 * squared-distance mouse check, cached bounding rect.
 */
const MagneticParticleText: React.FC<MagneticParticleTextProps> = ({
  text = "Developer",
  className = "",
  fontSize = 120,
  particleDensity = 3,
  colors = ["#e85d75", "#4a7ef5", "#8b5cf6", "#36c2b8", "#f28b3a"],
  mouseRadius = 100,
  mouseForce = 0.8,
  springStiffness = 0.04,
  damping = 0.88,
  noiseAmount = 1.2,
  particleSize = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const initializedRef = useRef(false);

  // SoA (struct-of-arrays) for particle data — much faster iteration
  const pData = useRef<{
    x: Float32Array;
    y: Float32Array;
    vx: Float32Array;
    vy: Float32Array;
    originX: Float32Array;
    originY: Float32Array;
    size: Float32Array;
    colorIdx: Uint8Array;
    count: number;
  }>({ x: new Float32Array(0), y: new Float32Array(0), vx: new Float32Array(0), vy: new Float32Array(0), originX: new Float32Array(0), originY: new Float32Array(0), size: new Float32Array(0), colorIdx: new Uint8Array(0), count: 0 });

  // Fresh getBoundingClientRect on every mousemove — avoids stale rect offset
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mouseRef.current = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
      active: true,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    // Pre-compute color strings with a few brightness variants each
    const colorVariants: string[][] = colors.map((hex) => {
      const variants: string[] = [];
      for (let b = 0; b < 4; b++) {
        const factor = 0.8 + b * 0.13;
        variants.push(adjustBrightness(hex, factor));
      }
      return variants;
    });

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width * dpr;
      h = rect.height * dpr;
      canvas.width = w;
      canvas.height = h;

      const screenScale = Math.min(rect.width / 900, 1);
      const scaledFontSize = fontSize * screenScale * dpr;

      // Offscreen canvas to sample text pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.fillStyle = "#000";
      offCtx.font = `900 ${scaledFontSize}px 'Space Grotesk', sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const letters = text.split("");
      const totalWidth = offCtx.measureText(text).width;
      const startX = (w - totalWidth) / 2;

      const letterBounds: { x: number; w: number }[] = [];
      let currentX = startX;
      for (const letter of letters) {
        const lw = offCtx.measureText(letter).width;
        letterBounds.push({ x: currentX, w: lw });
        offCtx.fillText(letter, currentX + lw / 2, h / 2);
        currentX += lw;
      }

      const imageData = offCtx.getImageData(0, 0, w, h);
      const data = imageData.data;
      // Wider gap → fewer particles → faster
      const gap = Math.max(2, Math.round(5 / particleDensity));

      // Count first to pre-allocate
      let count = 0;
      for (let py = 0; py < h; py += gap) {
        for (let px = 0; px < w; px += gap) {
          if (data[(py * w + px) * 4 + 3] > 128) count++;
        }
      }

      const x = new Float32Array(count);
      const y = new Float32Array(count);
      const vx = new Float32Array(count);
      const vy = new Float32Array(count);
      const originX = new Float32Array(count);
      const originY = new Float32Array(count);
      const size = new Float32Array(count);
      const colorIdxArr = new Uint8Array(count);

      let idx = 0;
      const wasInit = initializedRef.current;

      for (let py = 0; py < h; py += gap) {
        for (let px = 0; px < w; px += gap) {
          if (data[(py * w + px) * 4 + 3] > 128) {
            originX[idx] = px;
            originY[idx] = py;
            size[idx] = particleSize * dpr * (0.6 + Math.random() * 0.8);
            // Random color per particle, not per letter
            colorIdxArr[idx] = Math.floor(Math.random() * colors.length);

            if (wasInit) {
              x[idx] = px;
              y[idx] = py;
            } else {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * Math.max(w, h) * 0.7;
              x[idx] = w / 2 + Math.cos(angle) * dist;
              y[idx] = h / 2 + Math.sin(angle) * dist;
              vx[idx] = (Math.random() - 0.5) * 3;
              vy[idx] = (Math.random() - 0.5) * 3;
            }

            idx++;
          }
        }
      }

      pData.current = { x, y, vx, vy, originX, originY, size, colorIdx: colorIdxArr, count };
      if (!initializedRef.current) initializedRef.current = true;
    };

    buildParticles();

    const mRadiusSq = (mouseRadius * dpr) * (mouseRadius * dpr);
    const mRadiusVal = mouseRadius * dpr;

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isActive = mouseRef.current.active;

      const d = pData.current;
      const len = d.count;

      // Batch by color index for fewer fillStyle changes
      for (let ci = 0; ci < colors.length; ci++) {
        const variants = colorVariants[ci];
        ctx.fillStyle = variants[1]; // mid brightness
        ctx.globalAlpha = 0.9;

        for (let i = 0; i < len; i++) {
          if (d.colorIdx[i] !== ci) continue;

          // Noise breathing
          const ox = d.originX[i];
          const oy = d.originY[i];
          const nx = Math.sin(ox * 0.01 + t * 0.6) * Math.cos(oy * 0.012 + t * 0.42) * noiseAmount * dpr;
          const ny = Math.sin(oy * 0.01 + t * 0.5) * Math.cos(ox * 0.011 + t * 0.38) * noiseAmount * dpr * 0.7;
          const tx = ox + nx;
          const ty = oy + ny;

          // Spring
          d.vx[i] += (tx - d.x[i]) * springStiffness;
          d.vy[i] += (ty - d.y[i]) * springStiffness;

          // Mouse repulsion — squared distance, no sqrt
          if (isActive) {
            const mdx = d.x[i] - mx;
            const mdy = d.y[i] - my;
            const distSq = mdx * mdx + mdy * mdy;
            if (distSq < mRadiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq); // only sqrt when inside radius
              const force = (1 - dist / mRadiusVal) * mouseForce * dpr;
              d.vx[i] += (mdx / dist) * force * 3;
              d.vy[i] += (mdy / dist) * force * 3;
            }
          }

          // Damping + integrate
          d.vx[i] *= damping;
          d.vy[i] *= damping;
          d.x[i] += d.vx[i];
          d.y[i] += d.vy[i];

          // Draw — simple fillRect, no save/restore
          const s = d.size[i];
          ctx.fillRect(d.x[i] - s * 0.5, d.y[i] - s * 0.5, s, s);
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      buildParticles();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animRef.current);
    };
  }, [
    text, fontSize, particleDensity, colors, mouseRadius,
    mouseForce, springStiffness, damping, noiseAmount,
     particleSize, handleMouseMove,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ touchAction: "none" }}
    />
  );
};

function adjustBrightness(hex: string, factor: number): string {
  const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) * factor));
  return `rgb(${r},${g},${b})`;
}

export default MagneticParticleText;
