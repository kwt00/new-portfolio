import { useState, useCallback } from "react";
import routingData from "../../data/routing_data.json";

/**
 * Interactive Cross-Layer Direction Similarity Matrix - 12x12 grid.
 * Uses REAL cosine similarity data extracted from the trained model.
 *
 * Diagonal ~ 1.0 (self-similarity), off-diagonal ~ 0.21 (near-orthogonal).
 *
 * Fixes vs prior version:
 * - drops the max-w-md cap so the matrix fills the figure box
 * - tooltips flip below for top rows so they don't get cut off
 * - numeric layer labels (0..11) on both axes instead of just an arrow
 * - smaller hover scale (1.25x) so cells don't escape the grid
 * - dedicated "currently hovered" readout below the chart
 */

const LAYERS = routingData.config.n_layers as number;
const SIMILARITY = routingData.direction_similarity as number[][];

function simToColor(value: number): string {
  // Map 0.15-1.0 → 0-1 for color interp (off-diag ~0.21, diag = 1.0)
  const t = Math.max(0, Math.min(1, (value - 0.15) / 0.85));
  if (t < 0.15) {
    return `rgb(${Math.round(20 + t * 200)}, ${Math.round(55 + t * 300)}, ${Math.round(155 + t * 100)})`;
  } else if (t < 0.5) {
    const s = (t - 0.15) / 0.35;
    return `rgb(${Math.round(50 + s * 120)}, ${Math.round(100 + s * 80)}, ${Math.round(170 - s * 30)})`;
  } else {
    const s = (t - 0.5) / 0.5;
    return `rgb(${Math.round(170 + s * 55)}, ${Math.round(180 - s * 140)}, ${Math.round(140 - s * 110)})`;
  }
}

const DirectionSimilarity = () => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const onCellEnter = useCallback((row: number, col: number) => setHoveredCell({ row, col }), []);
  const onCellLeave = useCallback(() => setHoveredCell(null), []);

  const hoveredValue =
    hoveredCell !== null ? SIMILARITY[hoveredCell.row][hoveredCell.col] : null;

  // Column header (X axis): layer numbers
  const colHeader = (
    <div
      className="grid gap-px"
      style={{ gridTemplateColumns: `repeat(${LAYERS}, 1fr)`, paddingLeft: 28 }}
    >
      {Array.from({ length: LAYERS }, (_, j) => (
        <div
          key={j}
          className="text-center font-mono text-[10px] font-bold text-[var(--color-text-muted)] py-1"
        >
          {j}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* Title row */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Cross-layer direction similarity
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Layer (column) →
        </span>
      </div>

      {colHeader}

      <div className="flex">
        {/* Y-axis: layer numbers */}
        <div
          className="grid gap-px mr-1 shrink-0"
          style={{ gridTemplateRows: `repeat(${LAYERS}, 1fr)`, width: 24 }}
        >
          {Array.from({ length: LAYERS }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-end pr-1 font-mono text-[10px] font-bold text-[var(--color-text-muted)]"
            >
              {i}
            </div>
          ))}
        </div>

        {/* Matrix grid */}
        <div
          className="grid flex-1 border-[3px] border-[var(--color-text)]"
          style={{
            gridTemplateColumns: `repeat(${LAYERS}, 1fr)`,
            gridTemplateRows: `repeat(${LAYERS}, 1fr)`,
            boxShadow: "4px 4px 0px var(--color-text)",
          }}
        >
          {SIMILARITY.map((row, i) =>
            row.map((value, j) => {
              const isHovered = hoveredCell?.row === i && hoveredCell?.col === j;
              const isRowOrCol = hoveredCell?.row === i || hoveredCell?.col === j;
              const isDiagonal = i === j;

              return (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square relative transition-all duration-150"
                  style={{
                    backgroundColor: simToColor(value),
                    border: isDiagonal
                      ? "1.5px solid var(--color-text)"
                      : "0.5px solid rgba(26, 22, 19, 0.12)",
                    opacity: hoveredCell ? (isHovered ? 1 : isRowOrCol ? 0.85 : 0.45) : 1,
                    transform: isHovered ? "scale(1.25)" : "scale(1)",
                    zIndex: isHovered ? 20 : isRowOrCol ? 10 : 0,
                    boxShadow: isHovered ? "2px 2px 0px var(--color-text)" : "none",
                  }}
                  onMouseEnter={() => onCellEnter(i, j)}
                  onMouseLeave={onCellLeave}
                  data-cursor-hover
                />
              );
            })
          )}
        </div>
      </div>

      {/* Color legend + persistent readout */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] shrink-0">
          Orthogonal
        </span>
        <div
          className="flex-1 min-w-[80px] h-3 border-[2px] border-[var(--color-text)]"
          style={{
            background:
              "linear-gradient(to right, rgb(20,55,155), rgb(110,140,155), rgb(225,40,30))",
          }}
        />
        <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] shrink-0">
          Identical
        </span>

        <div className="ml-auto font-mono text-[11px] font-bold text-[var(--color-text)] tabular-nums min-w-[150px] text-right">
          {hoveredCell ? (
            <>
              L{hoveredCell.row} ↔ L{hoveredCell.col}: {hoveredValue!.toFixed(3)}
            </>
          ) : (
            <span className="text-[var(--color-text-muted)] font-normal">
              hover any cell
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectionSimilarity;
