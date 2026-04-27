import { useState, useCallback } from "react";
import routingData from "../../data/routing_data.json";

/**
 * Interactive Cross-Layer Direction Similarity Matrix - 12x12 grid.
 * Uses REAL cosine similarity data extracted from the trained model.
 *
 * Diagonal ~ 1.0 (self-similarity), off-diagonal ~ 0.21 (near-orthogonal).
 * The model independently learned perpendicular suppression directions
 * at every layer with no design pressure.
 */

const LAYERS = routingData.config.n_layers;
const SIMILARITY = routingData.direction_similarity;

// Color scale tuned for the actual data range (0.2 - 1.0)
function simToColor(value: number): string {
  // Stretch: off-diagonal is ~0.21, diagonal is 1.0
  // Map 0.15-1.0 to 0-1 for color interpolation
  const t = Math.max(0, Math.min(1, (value - 0.15) / 0.85));

  if (t < 0.15) {
    // Deep blue (cold / orthogonal)
    return `rgb(${Math.round(20 + t * 200)}, ${Math.round(55 + t * 300)}, ${Math.round(155 + t * 100)})`;
  } else if (t < 0.5) {
    // Blue -> pale
    const s = (t - 0.15) / 0.35;
    return `rgb(${Math.round(50 + s * 120)}, ${Math.round(100 + s * 80)}, ${Math.round(170 - s * 30)})`;
  } else {
    // Pale -> hot red
    const s = (t - 0.5) / 0.5;
    return `rgb(${Math.round(170 + s * 55)}, ${Math.round(180 - s * 140)}, ${Math.round(140 - s * 110)})`;
  }
}

const DirectionSimilarity = () => {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellHover = useCallback(
    (row: number, col: number) => setHoveredCell({ row, col }),
    []
  );
  const handleCellLeave = useCallback(() => setHoveredCell(null), []);

  return (
    <div className="w-full max-w-md">
      {/* Axis label */}
      <div className="flex items-center mb-2 pl-8">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
          {"Layer ->"}
        </span>
      </div>

      <div className="flex">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center mr-1 w-6">
          <span
            className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            {"Layer ->"}
          </span>
        </div>

        {/* Matrix grid */}
        <div
          className="grid flex-1 border-[4px] border-[var(--color-text)]"
          style={{
            gridTemplateColumns: `repeat(${LAYERS}, 1fr)`,
            gridTemplateRows: `repeat(${LAYERS}, 1fr)`,
            boxShadow: "5px 5px 0px var(--color-text)",
          }}
        >
          {SIMILARITY.map((row: number[], i: number) =>
            row.map((value: number, j: number) => {
              const isHovered =
                hoveredCell?.row === i && hoveredCell?.col === j;
              const isRowOrCol =
                hoveredCell?.row === i || hoveredCell?.col === j;
              const isDiagonal = i === j;

              return (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square relative transition-all duration-200 ease-out"
                  style={{
                    backgroundColor: simToColor(value),
                    border: isDiagonal
                      ? "1.5px solid var(--color-text)"
                      : "0.5px solid rgba(26, 22, 19, 0.15)",
                    opacity: hoveredCell
                      ? isHovered
                        ? 1
                        : isRowOrCol
                        ? 0.85
                        : 0.45
                      : 1,
                    transform: isHovered ? "scale(1.5)" : "scale(1)",
                    zIndex: isHovered ? 20 : isRowOrCol ? 10 : 0,
                    boxShadow: isHovered
                      ? "3px 3px 0px var(--color-text)"
                      : "none",
                  }}
                  onMouseEnter={() => handleCellHover(i, j)}
                  onMouseLeave={handleCellLeave}
                  data-cursor-hover
                >
                  {isHovered && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--color-text)] text-[var(--color-bg)] text-[10px] font-mono font-bold whitespace-nowrap z-30 border-[2px] border-[var(--color-text)]"
                      style={{ boxShadow: "2px 2px 0px var(--color-text-muted)" }}
                    >
                      {"L"}{i}{" <-> L"}{j}{": "}{value.toFixed(3)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-[8px] sm:text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] shrink-0">
          Orthogonal
        </span>
        <div
          className="flex-1 mx-2 sm:mx-3 h-2.5 sm:h-3 border-[2px] border-[var(--color-text)]"
          style={{
            background: `linear-gradient(to right, rgb(20,55,155), rgb(110,140,155), rgb(225,40,30))`,
          }}
        />
        <span className="text-[8px] sm:text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] shrink-0">
          Identical
        </span>
      </div>
    </div>
  );
};

export default DirectionSimilarity;
