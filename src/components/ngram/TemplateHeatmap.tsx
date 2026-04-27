import { useRef, useEffect, useState, useMemo } from "react";

/**
 * TemplateHeatmap - interactive per-template accuracy grid.
 * Rows: models, Columns: contract templates. Hover to see exact values.
 * Column winners get a gold crown. "Ours" row is clearly highlighted.
 */

const TEMPLATES = [
  "bill of sale", "commercial loan", "contractor", "employment",
  "lease", "merger agreement", "nda", "power of attorney",
  "promissory note", "purchase agreement", "rental application", "service agreement",
];

const MODELS = [
  { label: "NER only", key: "ner" },
  { label: "SA only", key: "sa" },
  { label: "Ours (full)", key: "ours" },
  { label: "GPT-4o-mini", key: "mini" },
  { label: "GPT-5", key: "gpt5" },
];

// Per-template accuracy data: [model_key][template_idx]
const DATA: Record<string, number[]> = {
  ner:  [90, 92, 90, 91, 96, 95, 95, 88, 100, 93, 100, 97],
  sa:   [100, 98, 93, 100, 100, 92, 100, 100, 100, 93, 100, 94],
  ours: [100, 99, 93, 100, 100, 95, 100, 100, 100, 93, 100, 100],
  mini: [100, 86, 97, 96, 100, 92, 95, 96, 100, 100, 100, 94],
  gpt5: [93, 99, 100, 96, 95, 98, 95, 92, 100, 96, 100, 94],
};

function accuracyColor(v: number, isOursRow: boolean): string {
  if (isOursRow) {
    // Blue tints for "ours" row
    if (v >= 99) return "rgb(59, 130, 246)";     // strong blue
    if (v >= 95) return "rgb(96, 165, 250)";     // medium blue
    if (v >= 92) return "rgb(147, 197, 253)";    // light blue
    return "rgb(191, 219, 254)";                  // very light blue
  }
  if (v >= 99) return "rgb(16, 185, 129)";
  if (v >= 95) return "rgb(52, 211, 153)";
  if (v >= 92) return "rgb(110, 231, 183)";
  if (v >= 88) return "rgb(167, 243, 208)";
  if (v >= 85) return "rgb(209, 250, 229)";
  return "rgb(254, 240, 138)";
}

const TemplateHeatmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Precompute column winners (row index of max value per column)
  const columnWinners = useMemo(() => {
    return TEMPLATES.map((_, colIdx) => {
      let maxVal = -1;
      let winnerRow = 0;
      MODELS.forEach((m, rowIdx) => {
        const val = DATA[m.key][colIdx];
        if (val > maxVal) {
          maxVal = val;
          winnerRow = rowIdx;
        }
      });
      return { winnerRow, maxVal };
    });
  }, []);

  // Count wins per model
  const winCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MODELS.forEach((m) => { counts[m.key] = 0; });
    columnWinners.forEach(({ winnerRow }) => {
      counts[MODELS[winnerRow].key]++;
    });
    return counts;
  }, [columnWinners]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, 1 - (rect.top - window.innerHeight * 0.6) / (window.innerHeight * 0.3))
      );
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="border-[4px] border-[var(--color-text)] bg-[var(--color-surface)] overflow-x-auto"
        style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
      >
        <div className="min-w-[700px]">
          {/* Column headers */}
          <div
            className="grid border-b-[3px] border-[var(--color-text)]"
            style={{ gridTemplateColumns: `110px repeat(${TEMPLATES.length}, 1fr)` }}
          >
            <div className="p-2" />
            {TEMPLATES.map((t, i) => (
              <div
                key={i}
                className="p-1.5 text-[7px] md:text-[8px] font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-[0.05em] text-center leading-tight border-l-[1px] border-[var(--color-text)]"
                style={{ opacity: Math.min(1, progress * 2) }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Rows */}
          {MODELS.map((m, rowIdx) => {
            const isOursRow = m.key === "ours";
            const rowDelay = rowIdx * 0.08;
            const rowProgress = Math.max(0, Math.min(1, (progress - rowDelay) / (1 - rowDelay)));

            return (
              <div
                key={m.key}
                className="grid"
                style={{
                  gridTemplateColumns: `110px repeat(${TEMPLATES.length}, 1fr)`,
                  borderBottom: rowIdx < MODELS.length - 1 ? "1px solid var(--color-text)" : "none",
                  borderTop: isOursRow ? "3px solid var(--color-text)" : "none",
                  borderBottomWidth: isOursRow ? "3px" : undefined,
                }}
              >
                {/* Row label */}
                <div
                  className={`p-2 flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.05em] ${
                    isOursRow
                      ? "bg-[var(--color-blue)] text-white"
                      : "text-[var(--color-text)]"
                  }`}
                  style={{ opacity: rowProgress }}
                >
                  {isOursRow && <span className="text-[8px]">*</span>}
                  {m.label}
                  {isOursRow && (
                    <span className="ml-auto text-[7px] opacity-75">{winCounts[m.key]}W</span>
                  )}
                </div>

                {/* Cells */}
                {DATA[m.key].map((val, colIdx) => {
                  const cellDelay = rowDelay + colIdx * 0.015;
                  const cellProgress = Math.max(0, Math.min(1, (progress - cellDelay) / (1 - cellDelay)));
                  const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                  const isColHighlight = hoveredCell?.col === colIdx;
                  const isRowHighlight = hoveredCell?.row === rowIdx;
                  const isWinner = columnWinners[colIdx].winnerRow === rowIdx;
                  // Tied winners: check if this cell equals the max for the column
                  const isTied = val === columnWinners[colIdx].maxVal && !isWinner;

                  return (
                    <div
                      key={colIdx}
                      className="relative flex items-center justify-center p-1 border-l-[1px] border-[var(--color-text)] transition-all duration-150"
                      style={{
                        backgroundColor: cellProgress > 0.5 ? accuracyColor(val, isOursRow) : "transparent",
                        opacity: cellProgress,
                        outline: isHovered
                          ? "2px solid var(--color-text)"
                          : isColHighlight || isRowHighlight
                            ? "1px solid var(--color-text)"
                            : "none",
                        outlineOffset: "-1px",
                        zIndex: isHovered ? 10 : 0,
                        boxShadow: "none",
                      }}
                      onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      data-cursor-hover
                    >
                      <span
                        className={`text-[10px] md:text-[11px] font-mono font-bold ${
                          isOursRow
                            ? val >= 99 ? "text-white" : "text-blue-900"
                            : val >= 98 ? "text-green-900" : val >= 90 ? "text-green-800" : "text-yellow-800"
                        }`}
                        style={{ opacity: cellProgress }}
                      >
                        {val}{(isWinner || isTied) && cellProgress > 0.5 ? " *" : ""}
                      </span>

                      {isHovered && (
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--color-text)] text-[var(--color-bg)] text-[9px] font-mono font-bold whitespace-nowrap z-30"
                          style={{ boxShadow: "2px 2px 0px var(--color-text-muted)" }}
                        >
                          {m.label} / {TEMPLATES[colIdx]}: {val}%
                          {(isWinner || isTied) ? " * BEST" : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateHeatmap;
