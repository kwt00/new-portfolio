import { useEffect, useRef } from "react";

interface FlowFieldProps {
  className?: string;
  colors?: string[];
  lineCount?: number;
  speed?: number;
  mouseInfluence?: number;
}

/**
 * Flowing 3D wave mesh - horizontal contour lines rendered in perspective,
 * displaced by layered sine waves. Mouse creates ripple distortions.
 * Grotesque-bold variant with thicker, more saturated lines.
 */
const FlowField: React.FC<FlowFieldProps> = ({
  className = "",
  colors = ["#e85d75", "#5b8cf5", "#9b72f2", "#4ecdc4", "#f2994a"],
  lineCount = 45,
  speed = 1,
  mouseInfluence = 0.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        active: true,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const pointsPerLine = 120;
    const vanishY = 0.28;

    const colorRGB = colors.map((hex) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    }));

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const getColor = (t: number, alpha: number) => {
      const pos = t * (colorRGB.length - 1);
      const i = Math.floor(pos);
      const f = pos - i;
      const c1 = colorRGB[Math.min(i, colorRGB.length - 1)];
      const c2 = colorRGB[Math.min(i + 1, colorRGB.length - 1)];
      const r = Math.round(lerp(c1.r, c2.r, f));
      const g = Math.round(lerp(c1.g, c2.g, f));
      const b = Math.round(lerp(c1.b, c2.b, f));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const animate = (now: number) => {
      const t = now * 0.001 * speed;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      for (let li = 0; li < lineCount; li++) {
        const depth = li / (lineCount - 1);
        const perspDepth = Math.pow(depth, 1.6);
        const baseY = vanishY + perspDepth * (1 - vanishY);

        // Grotesque: bolder lines, higher alpha
        const alpha = 0.1 + depth * 0.35;
        const lineWidth = 0.6 + depth * 1.8;

        const spread = 0.3 + depth * 0.7;
        const xStart = 0.5 - spread * 0.6;
        const xEnd = 0.5 + spread * 0.6;
        const colorT = depth;

        ctx.beginPath();
        ctx.strokeStyle = getColor(colorT, alpha);
        ctx.lineWidth = lineWidth;

        for (let pi = 0; pi <= pointsPerLine; pi++) {
          const px = pi / pointsPerLine;
          const screenX = lerp(xStart, xEnd, px) * w;
          const wx = (px - 0.5) * 2;
          const wz = (depth - 0.5) * 2;

          let displacement = 0;
          displacement += Math.sin(wx * 2.2 + t * 0.7 + wz * 1.5) * 0.35;
          displacement += Math.cos(wz * 3.0 + t * 0.5 + wx * 0.8) * 0.2;
          displacement += Math.sin(wx * 5.0 + wz * 3.5 + t * 1.2) * 0.1;
          displacement += Math.cos((wx + wz) * 2.5 + t * 0.9) * 0.15;

          if (mActive) {
            const dx = px - mx;
            const dy = depth - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ripple =
              Math.sin(dist * 18 - t * 4) *
              Math.exp(-dist * 4) *
              mouseInfluence;
            displacement += ripple;
          }

          const perspScale = 0.3 + depth * 0.7;
          const yOffset = displacement * perspScale * h * 0.06;
          const edgeFade = 1 - Math.pow(Math.abs(px - 0.5) * 2, 3);
          const finalY = baseY * h + yOffset * edgeFade;

          if (pi === 0) {
            ctx.moveTo(screenX, finalY);
          } else {
            ctx.lineTo(screenX, finalY);
          }
        }

        ctx.stroke();
      }

      // Subtle cross-lines for mesh structure
      const crossLineCount = 20;
      for (let ci = 0; ci <= crossLineCount; ci++) {
        const px = ci / crossLineCount;
        if (px < 0.12 || px > 0.88) continue;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(212, 202, 191, 0.06)`;
        ctx.lineWidth = 0.7;

        for (let li = 0; li < lineCount; li += 2) {
          const depth = li / (lineCount - 1);
          const perspDepth = Math.pow(depth, 1.6);
          const baseY = vanishY + perspDepth * (1 - vanishY);

          const spread = 0.3 + depth * 0.7;
          const xStart = 0.5 - spread * 0.6;
          const xEnd = 0.5 + spread * 0.6;
          const screenX = lerp(xStart, xEnd, px) * w;

          const wx = (px - 0.5) * 2;
          const wz = (depth - 0.5) * 2;

          let displacement = 0;
          displacement += Math.sin(wx * 2.2 + t * 0.7 + wz * 1.5) * 0.35;
          displacement += Math.cos(wz * 3.0 + t * 0.5 + wx * 0.8) * 0.2;
          displacement += Math.sin(wx * 5.0 + wz * 3.5 + t * 1.2) * 0.1;
          displacement += Math.cos((wx + wz) * 2.5 + t * 0.9) * 0.15;

          if (mActive) {
            const dx = px - mx;
            const dy = depth - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            displacement +=
              Math.sin(dist * 18 - t * 4) *
              Math.exp(-dist * 4) *
              mouseInfluence;
          }

          const perspScale = 0.3 + depth * 0.7;
          const edgeFade = 1 - Math.pow(Math.abs(px - 0.5) * 2, 3);
          const finalY = baseY * h + displacement * perspScale * h * 0.06 * edgeFade;

          if (li === 0) {
            ctx.moveTo(screenX, finalY);
          } else {
            ctx.lineTo(screenX, finalY);
          }
        }

        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [colors, lineCount, speed, mouseInfluence]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};

export default FlowField;
