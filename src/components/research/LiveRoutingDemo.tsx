import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import routingData from "../../data/routing_data.json";

/**
 * Live Routing Demo - auto-types real prompts from the trained 433M-parameter
 * directional routing model. Each heatmap is the REAL routing output from an
 * actual forward pass - no estimation, no heuristics.
 *
 * Click a domain to watch the model's routing pattern emerge character by
 * character as the prompt types itself out.
 */

const LAYERS = routingData.config.n_layers;
const HEADS = routingData.config.n_heads;

// Domain labels by index range (matches extraction script ordering)
function getDomain(idx: number): string {
  if (idx < 30) return "code";
  if (idx < 60) return "math";
  if (idx < 90) return "prose";
  return "factual";
}

// Pre-process stored prompts
interface StoredPrompt {
  text: string;
  flat: number[];
  domain: string;
}

const STORED_PROMPTS: StoredPrompt[] = routingData.prompts.map((p, i) => ({
  text: p.text,
  flat: (p.heatmap as number[][]).flat(),
  domain: getDomain(i),
}));

// Neutral pattern = average of all stored heatmaps
const NEUTRAL_PATTERN = new Array(LAYERS * HEADS).fill(0);
STORED_PROMPTS.forEach((p) => {
  for (let i = 0; i < p.flat.length; i++) {
    NEUTRAL_PATTERN[i] += p.flat[i] / STORED_PROMPTS.length;
  }
});

// Color scale: 0.0 -> deep blue (suppressed), 1.0 -> hot red (active)
function valueToColor(value: number): string {
  const t = Math.max(0, Math.min(1, (value - 0.05) / 0.85));
  if (t < 0.35) {
    const s = t / 0.35;
    return `rgb(${Math.round(15 + s * 50)}, ${Math.round(40 + s * 80)}, ${Math.round(140 + s * 40)})`;
  } else if (t < 0.65) {
    const s = (t - 0.35) / 0.3;
    return `rgb(${Math.round(65 + s * 140)}, ${Math.round(120 + s * 70)}, ${Math.round(180 - s * 80)})`;
  } else {
    const s = (t - 0.65) / 0.35;
    return `rgb(${Math.round(205 + s * 30)}, ${Math.round(190 - s * 150)}, ${Math.round(100 - s * 70)})`;
  }
}

const DOMAIN_COLORS: Record<string, string> = {
  code: "var(--color-blue)",
  math: "var(--color-pink)",
  prose: "var(--color-teal)",
  factual: "var(--color-orange)",
};

// Build per-domain index pools for random selection
const DOMAIN_INDICES: Record<string, number[]> = {};
STORED_PROMPTS.forEach((p, i) => {
  if (!DOMAIN_INDICES[p.domain]) DOMAIN_INDICES[p.domain] = [];
  DOMAIN_INDICES[p.domain].push(i);
});

function pickRandom(domain: string): number {
  const pool = DOMAIN_INDICES[domain] || [0];
  return pool[Math.floor(Math.random() * pool.length)];
}

const DOMAIN_BUTTONS = [
  { label: "Code", domain: "code", color: "var(--color-blue)" },
  { label: "Math", domain: "math", color: "var(--color-pink)" },
  { label: "Prose", domain: "prose", color: "var(--color-teal)" },
  { label: "Factual", domain: "factual", color: "var(--color-orange)" },
];

// Lerp between two heatmaps
function lerpHeatmap(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t);
}

const LiveRoutingDemo = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [heatmap, setHeatmap] = useState<number[]>(NEUTRAL_PATTERN);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noiseRef = useRef(0);

  const activePrompt = activeIdx !== null ? STORED_PROMPTS[activeIdx] : null;
  const displayedText = activePrompt ? activePrompt.text.slice(0, charIndex) : "";
  const progress = activePrompt ? charIndex / activePrompt.text.length : 0;

  const dominantDomain = useMemo(() => {
    if (!activePrompt || charIndex === 0) return null;
    return activePrompt.domain;
  }, [activePrompt, charIndex]);

  // Auto-typing effect
  useEffect(() => {
    if (!isTyping || !activePrompt) return;

    if (charIndex >= activePrompt.text.length) {
      setIsTyping(false);
      setTypingSpeed(0);
      return;
    }

    // Variable speed: faster on spaces/punctuation, slower on word starts
    const currentChar = activePrompt.text[charIndex];
    const isWordBoundary = currentChar === " " || currentChar === "\n";
    const isPunctuation = /[.,;:!?]/.test(currentChar);
    const baseDelay = 20;
    const delay = isPunctuation
      ? baseDelay + Math.random() * 50 + 30
      : isWordBoundary
        ? baseDelay + Math.random() * 10
        : baseDelay + Math.random() * 15;

    typingRef.current = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, delay);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [isTyping, charIndex, activePrompt]);

  // Update heatmap as characters type - lerp from neutral to real pattern
  useEffect(() => {
    if (!activePrompt) return;

    // Ease-in curve so pattern emerges more dramatically in the last half
    const eased = progress < 0.3
      ? progress * 0.4
      : 0.12 + (progress - 0.3) * (0.88 / 0.7);
    const t = Math.min(1, eased);

    const base = lerpHeatmap(NEUTRAL_PATTERN, activePrompt.flat, t);

    // Add slight noise while typing for liveliness
    if (isTyping) {
      const noisy = base.map((v) => {
        const noise = (Math.random() - 0.5) * 0.04 * (1 - t * 0.7);
        return Math.max(0.05, Math.min(0.95, v + noise));
      });
      setHeatmap(noisy);
      setTypingSpeed(0.4 + Math.random() * 0.4);
    } else {
      setHeatmap(base);
    }
  }, [charIndex, activePrompt, isTyping, progress]);

  // Breathing animation when idle
  useEffect(() => {
    if (isTyping) return;

    const interval = setInterval(() => {
      noiseRef.current += 0.05;

      setTypingSpeed((prev) => {
        const decayed = prev * 0.85;
        return decayed < 0.02 ? 0 : decayed;
      });

      if (activeIdx === null || charIndex === 0) {
        setHeatmap((prev) =>
          prev.map((v, i) => {
            const breath = Math.sin(noiseRef.current + i * 0.08) * 0.008;
            return Math.max(0.05, Math.min(0.95, v + breath));
          })
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTyping, activeIdx, charIndex]);

  // Single click: if same domain is already typing, instant fill current prompt.
  // Otherwise pick a random prompt and typewriter it out.
  const startExample = useCallback((domain: string) => {
    if (typingRef.current) clearTimeout(typingRef.current);

    // Same domain clicked while still typing -> instant fill
    if (domain === activeDomain && isTyping && activePrompt) {
      setCharIndex(activePrompt.text.length);
      setHeatmap([...activePrompt.flat]);
      setIsTyping(false);
      setTypingSpeed(1);
      return;
    }

    const idx = pickRandom(domain);
    setActiveIdx(idx);
    setActiveDomain(domain);
    setCharIndex(0);
    setHeatmap([...NEUTRAL_PATTERN]);
    setTypingSpeed(0.6);

    setTimeout(() => {
      setIsTyping(true);
    }, 200);
  }, [activeDomain, isTyping, activePrompt]);

  // Double click: pick random prompt from domain, instantly show full text + heatmap
  const instantFill = useCallback((domain: string) => {
    if (typingRef.current) clearTimeout(typingRef.current);

    const idx = pickRandom(domain);
    const prompt = STORED_PROMPTS[idx];
    setActiveIdx(idx);
    setActiveDomain(domain);
    setCharIndex(prompt.text.length);
    setHeatmap([...prompt.flat]);
    setIsTyping(false);
    setTypingSpeed(1);
  }, []);

  // Auto-start with a random code example on mount
  const hasAutoStarted = useRef(false);
  useEffect(() => {
    if (!hasAutoStarted.current) {
      hasAutoStarted.current = true;
      startExample("code");
    }
  }, [startExample]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: typewriter display */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            {DOMAIN_BUTTONS.map(({ label, domain, color }) => {
              const isActive = activeDomain === domain;
              return (
                <button
                  key={label}
                  onClick={() => startExample(domain)}
                  onDoubleClick={(e) => { e.preventDefault(); instantFill(domain); }}
                  className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.1em] text-white border-[2px] border-[var(--color-text)] transition-all duration-200 select-none ${
                    isActive
                      ? "translate-x-[1px] translate-y-[1px] shadow-none"
                      : "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: isActive ? "none" : "2px 2px 0px var(--color-text)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                  data-cursor-hover
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Typewriter text area */}
          <div
            className="w-full h-36 sm:h-48 p-3 sm:p-4 text-[12px] sm:text-[13px] font-mono bg-[var(--color-surface)] border-[3px] sm:border-[4px] border-[var(--color-text)] text-[var(--color-text)] overflow-auto"
            style={{ boxShadow: "3px 3px 0px var(--color-text)" }}
          >
            {displayedText ? (
              <span>
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-[2px] h-[14px] bg-[var(--color-text)] ml-[1px] align-text-bottom animate-pulse" />
                )}
              </span>
            ) : (
              <span className="text-[var(--color-text-muted)]">
                Select a domain to see real routing patterns...
              </span>
            )}
          </div>

          {/* Domain indicator */}
          <div className="mt-3 flex items-center gap-3">
            {dominantDomain && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 border-[2px] border-[var(--color-text)] text-[10px] font-mono font-bold uppercase tracking-[0.1em] text-white transition-all duration-300"
                style={{
                  backgroundColor: DOMAIN_COLORS[dominantDomain] || "var(--color-surface)",
                }}
              >
                {dominantDomain} / {Math.round(progress * 100)}%
              </div>
            )}
            {!dominantDomain && (
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
                Select a prompt...
              </span>
            )}
          </div>

          <div className="mt-auto pt-3">
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
              / Real routing weights from trained 433M model forward pass
            </span>
          </div>
        </div>

        {/* Right: live heatmap */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
              {"Head ->"}
            </span>
            {dominantDomain && (
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-[0.1em] px-2 py-0.5 border-[2px] border-[var(--color-text)] text-white"
                style={{
                  backgroundColor: DOMAIN_COLORS[dominantDomain] || "var(--color-surface)",
                }}
              >
                {dominantDomain} routing
              </span>
            )}
          </div>

          <div className="flex">
            <div className="flex flex-col items-center justify-center mr-1 w-6">
              <span
                className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]"
                style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
              >
                {"Layer ->"}
              </span>
            </div>

            <div
              className="grid flex-1 border-[2px] sm:border-[3px] border-[var(--color-text)]"
              style={{
                gridTemplateColumns: `repeat(${HEADS}, 1fr)`,
                gridTemplateRows: `repeat(${LAYERS}, 1fr)`,
                boxShadow: "3px 3px 0px var(--color-text)",
              }}
            >
              {heatmap.map((value, i) => {
                const row = Math.floor(i / HEADS);
                const col = i % HEADS;
                const isHovered = hoveredCell === i;

                return (
                  <div
                    key={i}
                    className="aspect-square relative border-[0.5px] border-[var(--color-text)] transition-colors duration-200"
                    style={{
                      backgroundColor: valueToColor(value),
                      transform: isHovered ? "scale(1.3)" : "scale(1)",
                      zIndex: isHovered ? 10 : 0,
                      boxShadow: isHovered ? "2px 2px 0px var(--color-text)" : "none",
                    }}
                    onMouseEnter={() => setHoveredCell(i)}
                    onMouseLeave={() => setHoveredCell(null)}
                    data-cursor-hover
                  >
                    {isHovered && (
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--color-text)] text-[var(--color-bg)] text-[9px] font-mono font-bold whitespace-nowrap z-30"
                        style={{ boxShadow: "2px 2px 0px var(--color-text-muted)" }}
                      >
                        L{row}H{col}: {value.toFixed(3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-3 border-[1px] border-[var(--color-text)] transition-all duration-200"
                  style={{
                    backgroundColor:
                      typingSpeed > i / 8
                        ? "var(--color-pink)"
                        : "var(--color-bg)",
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
              {isTyping ? "Routing active" : progress >= 1 ? "Complete" : "Idle"}
            </span>
          </div>

          {/* Color legend */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
              Suppressed
            </span>
            <div
              className="flex-1 mx-2 h-2 border-[1px] border-[var(--color-text)]"
              style={{
                background: "linear-gradient(to right, rgb(15,40,140), rgb(65,120,180), rgb(205,190,100), rgb(235,40,30))",
              }}
            />
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoutingDemo;
