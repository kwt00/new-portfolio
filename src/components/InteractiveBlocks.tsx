import { useEffect, useRef, useCallback, useState } from "react";

interface Block {
  id: number;
  baseX: number; // 0-1 normalized position
  baseY: number;
  w: number;
  h: number;
  color: string;
  hasShadow: boolean;
  borderWidth: number;
  rotation: number;
  phase: number; // for sine drift
  speed: number;
  layer: number; // 0 = back, 1 = mid, 2 = front - parallax multiplier
}

const COLORS = [
  "var(--color-pink)",
  "var(--color-blue)",
  "var(--color-violet)",
  "var(--color-teal)",
  "var(--color-orange)",
];

const BG_COLOR = "var(--color-bg)";
const SURFACE_COLOR = "var(--color-surface)";
const TEXT_COLOR = "var(--color-text)";

/**
 * Floating grotesque blocks - thick bordered rectangles in accent colors
 * that drift, respond to cursor proximity, and parallax on scroll.
 * Pure DOM (no canvas) so they inherit the comic-book CSS aesthetic.
 */
const InteractiveBlocks = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const [blockStates, setBlockStates] = useState<
    { x: number; y: number; r: number; scale: number }[]
  >([]);

  // Generate blocks once
  const blocks = useRef<Block[]>([]);
  if (blocks.current.length === 0) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const layer = i < 6 ? 0 : i < 13 ? 1 : 2;
      const isFilled = Math.random() > 0.35;
      blocks.current.push({
        id: i,
        baseX: 0.05 + Math.random() * 0.9,
        baseY: 0.05 + Math.random() * 0.9,
        w: 30 + Math.random() * 80,
        h: 30 + Math.random() * 80,
        color: isFilled ? COLORS[i % COLORS.length] : Math.random() > 0.5 ? BG_COLOR : SURFACE_COLOR,
        hasShadow: Math.random() > 0.4,
        borderWidth: Math.random() > 0.5 ? 4 : 3,
        rotation: (Math.random() - 0.5) * 15,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        layer,
      });
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const container = containerRef.current;
      if (!container) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = container.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Scroll offset relative to container top
      const scrollOffset = -rect.top * 0.15;

      const newStates = blocks.current.map((block) => {
        // Base position
        let bx = block.baseX * cw;
        let by = block.baseY * ch;

        // Sine drift
        bx += Math.sin(t * block.speed + block.phase) * 12;
        by += Math.cos(t * block.speed * 0.7 + block.phase) * 8;

        // Parallax - layers move at different rates on scroll
        const parallaxMultiplier = [0.02, 0.06, 0.12][block.layer];
        by += scrollOffset * parallaxMultiplier;

        // Mouse repulsion
        const dx = bx - mx;
        const dy = by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 150;
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 40;
          bx += (dx / dist) * force;
          by += (dy / dist) * force;
        }

        // Rotation - base + slight mouse twist
        let rotation = block.rotation + Math.sin(t * block.speed * 0.5 + block.phase) * 3;
        if (dist < repelRadius && dist > 0) {
          rotation += (dx / dist) * 5;
        }

        // Scale pulse near cursor
        let scale = 1;
        if (dist < repelRadius) {
          scale = 1 + (1 - dist / repelRadius) * 0.08;
        }

        return { x: bx, y: by, r: rotation, scale };
      });

      setBlockStates(newStates);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {blocks.current.map((block, i) => {
        const state = blockStates[i];
        if (!state) return null;

        const opacity = [0.35, 0.6, 0.9][block.layer];
        const zIndex = block.layer * 10;

        return (
          <div
            key={block.id}
            className="absolute will-change-transform pointer-events-none"
            style={{
              width: block.w,
              height: block.h,
              left: state.x - block.w / 2,
              top: state.y - block.h / 2,
              transform: `rotate(${state.r}deg) scale(${state.scale})`,
              backgroundColor: block.color,
              border: `${block.borderWidth}px solid ${TEXT_COLOR}`,
              boxShadow: block.hasShadow
                ? `${block.borderWidth + 1}px ${block.borderWidth + 1}px 0px ${TEXT_COLOR}`
                : "none",
              opacity,
              zIndex,
            }}
          />
        );
      })}
    </div>
  );
};

export default InteractiveBlocks;
