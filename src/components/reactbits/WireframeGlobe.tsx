import { useEffect, useRef } from "react";

interface WireframeGlobeProps {
  className?: string;
  pointCount?: number;
  radius?: number;
  colors?: string[];
  connectionDistance?: number;
  rotationSpeed?: number;
  mouseInfluence?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  // scattered origin for assembly animation
  ox: number;
  oy: number;
  oz: number;
  // color index
  ci: number;
}

/**
 * 3D wireframe globe rendered on canvas.
 * Points distributed via Fibonacci sphere, connected by proximity.
 * Assembles from scattered chaos on mount, responds to mouse, rotates slowly.
 */
const WireframeGlobe: React.FC<WireframeGlobeProps> = ({
  className = "",
  pointCount = 220,
  radius = 1,
  colors = ["#e85d75", "#5b8cf5", "#9b72f2", "#4ecdc4", "#f2994a"],
  connectionDistance = 0.38,
  rotationSpeed = 0.15,
  mouseInfluence = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse relative to canvas center (normalized -1 to 1)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Generate Fibonacci sphere points
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points: Point3D[] = [];

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      // Random scatter origin (far away, for assembly)
      const scatter = 4 + Math.random() * 3;
      const sx = (Math.random() - 0.5) * scatter;
      const sy = (Math.random() - 0.5) * scatter;
      const sz = (Math.random() - 0.5) * scatter;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        ox: sx,
        oy: sy,
        oz: sz,
        ci: Math.floor((Math.atan2(z, x) / Math.PI + 1) * 0.5 * colors.length) % colors.length,
      });
    }

    // Pre-compute connections (pairs of indices where distance < threshold)
    const connections: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < connectionDistance) {
          connections.push([i, j]);
        }
      }
    }

    startTimeRef.current = performance.now();
    const assemblyDuration = 2000; // ms

    // Rotation helpers
    const rotateY = (px: number, py: number, pz: number, a: number) => ({
      x: px * Math.cos(a) - pz * Math.sin(a),
      y: py,
      z: px * Math.sin(a) + pz * Math.cos(a),
    });

    const rotateX = (px: number, py: number, pz: number, a: number) => ({
      x: px,
      y: py * Math.cos(a) - pz * Math.sin(a),
      z: py * Math.sin(a) + pz * Math.cos(a),
    });

    const fov = 3;

    const animate = (now: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const elapsed = now - startTimeRef.current;
      // Assembly progress: 0 -> 1 with ease-out cubic
      const rawProgress = Math.min(elapsed / assemblyDuration, 1);
      const progress = 1 - Math.pow(1 - rawProgress, 3);

      const time = now * 0.001;
      const yaw = time * rotationSpeed + mouseRef.current.x * mouseInfluence;
      const pitch = mouseRef.current.y * mouseInfluence * 0.5 + 0.15; // slight downward tilt

      const cx = w * 0.5;
      const cy = h * 0.5;
      const scale = Math.min(w, h) * 0.35;

      // Compute projected positions
      const projected: { x: number; y: number; z: number; depth: number }[] = [];

      for (const pt of points) {
        // Interpolate from scatter to target
        const ix = pt.ox + (pt.x - pt.ox) * progress;
        const iy = pt.oy + (pt.y - pt.oy) * progress;
        const iz = pt.oz + (pt.z - pt.oz) * progress;

        // Apply rotations
        const r1 = rotateY(ix, iy, iz, yaw);
        const r2 = rotateX(r1.x, r1.y, r1.z, pitch);

        const perspectiveScale = fov / (fov + r2.z);
        projected.push({
          x: cx + r2.x * scale * perspectiveScale,
          y: cy + r2.y * scale * perspectiveScale,
          z: r2.z,
          depth: perspectiveScale,
        });
      }

      // Draw connections first (behind points)
      for (const [i, j] of connections) {
        const a = projected[i];
        const b = projected[j];
        // Opacity based on depth (closer = more visible) and assembly progress
        const avgDepth = (a.depth + b.depth) * 0.5;
        const depthAlpha = Math.max(0, Math.min(1, (avgDepth - 0.3) * 1.2));
        const alpha = depthAlpha * 0.15 * progress;

        if (alpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(212, 202, 191, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw points (sorted back-to-front for correct overlap)
      const sortedIndices = projected
        .map((_, idx) => idx)
        .sort((a, b) => projected[a].z - projected[b].z);

      for (const idx of sortedIndices) {
        const p = projected[idx];
        const pt = points[idx];
        const depthAlpha = Math.max(0, Math.min(1, (p.depth - 0.3) * 1.5));
        const alpha = depthAlpha * progress;

        if (alpha < 0.01) continue;

        const pointRadius = Math.max(0.8, 2 * p.depth) * progress;
        const color = colors[pt.ci];

        // Glow for larger/closer points
        if (p.depth > 0.6 && progress > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pointRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.08);
          ctx.fill();
        }

        // Point
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, alpha * 0.7);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [pointCount, radius, colors, connectionDistance, rotationSpeed, mouseInfluence]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};

/** Convert hex color to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default WireframeGlobe;
