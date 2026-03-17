import AnimatedContent from "../components/reactbits/AnimatedContent";
import DirectionSimilarity from "../components/research/DirectionSimilarity";
import TrainingCurve from "../components/research/TrainingCurve";
import EfficiencyBars from "../components/research/EfficiencyBars";
import LiveRoutingDemo from "../components/research/LiveRoutingDemo";

/**
 * Research section — four interactive visualizations:
 * 1. Training curve (zoomed PPL, clear gap)
 * 2. Efficiency bars (cost vs gain)
 * 3. Cross-layer direction similarity (the dark diagonal)
 * 4. Live routing simulator (type text, see routing adapt)
 */
const Research = () => {
  return (
    <section id="research" className="relative py-20 sm:py-40 px-4 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="mb-6">
            <span className="text-[11px] font-mono font-bold text-[var(--color-pink)] uppercase tracking-[0.2em]">
              Research
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.1]">
              Directional Routing{" "}
              <span className="text-[var(--color-text-muted)]">in Transformers</span>
            </h2>
            <div className="flex flex-wrap gap-2 shrink-0 self-start">
              <a
                href="https://arxiv.org/abs/2603.14923"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border-[3px] border-[var(--color-text)] bg-[var(--color-pink)] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--color-accent-dim)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
                data-cursor-hover
              >
                Paper ↗
              </a>
              <a
                href="https://github.com/kwt00/moe-exp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border-[3px] border-[var(--color-text)] bg-[var(--color-text)] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--color-blue)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                style={{ boxShadow: "2px 2px 0px var(--color-border)" }}
                data-cursor-hover
              >
                GitHub ↗
              </a>
            </div>
          </div>
          <p className="text-[var(--color-text-muted)] text-base leading-[1.8] max-w-2xl mb-20">
            A lightweight mechanism that gives each attention head learned
            suppression directions controlled by a shared router — 31–56%
            perplexity reduction at 3.9% parameter cost. Disabling routing
            collapses factual recall to near-zero and induction accuracy from
            93.4% to 0.0%. Published on arXiv, March 2026.
          </p>
        </AnimatedContent>

        {/* Row 1: Training Curve + Efficiency Bars */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {/* Training Curve */}
          <AnimatedContent distance={30} delay={0.1}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-blue)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                01
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Training Convergence
              </h3>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
              Routed model converges to significantly lower perplexity with only
              +16M parameters. The gap widens throughout training — directional
              routing gets <em>more</em> effective as the model learns.
            </p>
            <TrainingCurve />
          </AnimatedContent>

          {/* Efficiency Bars */}
          <AnimatedContent distance={30} delay={0.15}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-orange)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                02
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Key Results
              </h3>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
              Perplexity reduction, zero-shot domain classification from routing
              patterns alone, and orthogonal learned structure — all without
              explicit supervision.
            </p>
            <EfficiencyBars />
          </AnimatedContent>
        </div>

        {/* Row 2: Direction Similarity (text + vis) */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-pink)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                  style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
                >
                  03
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                  Emergent Orthogonality
                </h3>
              </div>
              <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
                Each layer learns 48 suppression directions (4 per head × 12 heads).
                Without any design pressure, these 576 directions self-organized into
                nearly perpendicular subspaces across layers.
              </p>
              <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
                The diagonal lights up — each layer is similar only to itself.
                Off-diagonal is cold blue, meaning the directions learned at layer 3
                are geometrically orthogonal to those at layer 8. The model carved
                out independent feature channels at every depth.
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 border-[3px] border-[var(--color-text)] bg-[var(--color-surface)] text-[11px] font-mono font-bold uppercase tracking-[0.1em]"
                style={{ boxShadow: "3px 3px 0px var(--color-text)" }}
              >
                <span className="w-2 h-2 bg-[var(--color-pink)]" />
                μ = −0.0001 cosine similarity (near-zero)
              </div>
            </div>

            <DirectionSimilarity />
          </div>
        </AnimatedContent>

        {/* Row 3: Live Routing Simulator */}
        <AnimatedContent distance={30} delay={0.1}>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-violet)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                04
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                Live Routing Simulator
              </h3>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] sm:ml-auto px-2.5 py-1 border-[2px] border-[var(--color-text)] bg-[var(--color-teal)] text-white"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                Interactive
              </span>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-8 max-w-xl">
              Watch real routing weights activate as the model processes different
              domains. Click code, math, prose, or factual to see how the 12×12
              heatmap shifts — each pattern was extracted from a real forward pass.
            </p>
            <div
              className="p-3 sm:p-6 md:p-8 border-[3px] sm:border-[4px] border-[var(--color-text)] bg-[var(--color-surface)]"
              style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
            >
              <LiveRoutingDemo />
            </div>
          </div>
        </AnimatedContent>

        {/* Summary strip */}
        <AnimatedContent distance={20} delay={0.2}>
          <div className="mt-16 pt-8 border-t-[4px] border-[var(--color-text)]">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              {[
                { value: "31–56%", label: "PPL Reduction" },
                { value: "3.9%", label: "Param Cost" },
                { value: "576", label: "Learned Directions" },
                { value: "93→0%", label: "Induction w/o Routing" },
                { value: "433M", label: "Parameters" },
              ].map((stat, i) => (
                <div key={i} className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-mono tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] font-bold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default Research;
