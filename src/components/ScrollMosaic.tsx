import { useEffect, useRef, useState, useCallback } from "react";

const COLORS = [
  "var(--color-pink)",
  "var(--color-blue)",
  "var(--color-violet)",
  "var(--color-teal)",
  "var(--color-orange)",
];

const ROWS = 4;

function getColumns(): number {
  if (typeof window === "undefined") return 40;
  if (window.innerWidth < 480) return 12;
  if (window.innerWidth < 768) return 20;
  return 40;
}

interface CellState {
  filled: boolean;
  color: string;
  hovered: boolean;
}

/**
 * ScrollMosaic - a grid of small cells that fill with color as you scroll
 * past them, creating a wipe/reveal effect. Mouse hover triggers nearby cells.
 * Uses the thick-border grotesque style.
 */
const ScrollMosaic = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(getColumns);
  const [cells, setCells] = useState<CellState[]>(() =>
    Array.from({ length: getColumns() * ROWS }, () => ({
      filled: false,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      hovered: false,
    }))
  );
  const revealProgress = useRef(0);
  const mouseCol = useRef(-1);
  const mouseRow = useRef(-1);
  const colsRef = useRef(cols);

  // Respond to window resize - rebuild cells if col count changes
  useEffect(() => {
    const handleResize = () => {
      const newCols = getColumns();
      if (newCols !== colsRef.current) {
        colsRef.current = newCols;
        setCols(newCols);
        setCells(
          Array.from({ length: newCols * ROWS }, () => ({
            filled: false,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            hovered: false,
          }))
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll-driven fill: as the component scrolls into view, cells fill left->right
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            revealProgress.current = Math.min(1, ratio * 2.5);
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );
    observer.observe(container);

    const updateCells = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      const currentCols = colsRef.current;
      // Progress: 0 when bottom of element is at viewport bottom, 1 when top is past center
      const progress = Math.max(
        0,
        Math.min(1, 1 - (rect.top - viewH * 0.3) / (viewH * 0.5))
      );

      setCells((prev) =>
        prev.map((cell, i) => {
          const col = i % currentCols;
          const row = Math.floor(i / currentCols);
          // Staggered reveal - wave from left to right, offset by row
          const threshold = (col + row * 2) / (currentCols + ROWS * 2);
          const filled = progress > threshold;
          // Mouse hover - light up cells near cursor
          const hovered =
            mouseCol.current >= 0 &&
            Math.abs(col - mouseCol.current) <= 1 &&
            Math.abs(row - mouseRow.current) <= 1;

          if (cell.filled === filled && cell.hovered === hovered) return cell;
          return { ...cell, filled, hovered };
        })
      );
    };

    const handleScroll = () => {
      requestAnimationFrame(updateCells);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateCells();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cols]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cellW = rect.width / colsRef.current;
      const cellH = rect.height / ROWS;
      mouseCol.current = Math.floor(x / cellW);
      mouseRow.current = Math.floor(y / cellH);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    mouseCol.current = -1;
    mouseRow.current = -1;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-6xl mx-auto px-4 sm:px-8 md:px-12 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="grid border-[3px] sm:border-[4px] border-[var(--color-text)]"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className="aspect-square transition-[transform,box-shadow] duration-200 ease-out border-[0.5px] border-[var(--color-text)]"
            style={{
              backgroundColor: cell.filled
                ? cell.hovered
                  ? "var(--color-text)"
                  : cell.color
                : cell.hovered
                ? "var(--color-surface-hover)"
                : "var(--color-bg)",
              transform: cell.hovered ? "scale(1.3)" : "scale(1)",
              zIndex: cell.hovered ? 10 : 0,
              boxShadow: cell.hovered
                ? "2px 2px 0px var(--color-text)"
                : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollMosaic;
