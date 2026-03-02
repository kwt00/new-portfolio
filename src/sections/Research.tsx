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
    <section id="research" className="relative py-40 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="mb-6">
            <span className="text-[11px] font-mono font-bold text-[var(--color-pink)] uppercase tracking-[0.2em]">
              Published Research
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Directional Routing{" "}
            <span className="text-[var(--color-text-muted)]">in Transformers</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-base leading-[1.8] max-w-2xl mb-20">
            A lightweight mechanism that adds learned suppression directions to
            each attention head — 22% perplexity reduction at 3.9% parameter cost.
            576 learned directions, nearly orthogonal across layers, enabling
            96% zero-shot domain classification.
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
              The headline numbers — and all of them are wins. 22% perplexity
              reduction, near-perfect domain classification from routing patterns
              alone, and orthogonal learned structure with zero supervision.
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
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-violet)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                04
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Live Routing Simulator
              </h3>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] ml-auto px-2.5 py-1 border-[2px] border-[var(--color-text)] bg-[var(--color-teal)] text-white"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                Interactive
              </span>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-8 max-w-xl">
              Type anything and watch routing patterns shift in real-time. The model
              adapts its suppression weights based on input domain — try code, math,
              prose, or factual text to see how the heatmap changes.
            </p>
            <div
              className="p-6 md:p-8 border-[4px] border-[var(--color-text)] bg-[var(--color-surface)]"
              style={{ boxShadow: "6px 6px 0px var(--color-text)" }}
            >
              <LiveRoutingDemo />
            </div>
          </div>
        </AnimatedContent>

        {/* Summary strip */}
        <AnimatedContent distance={20} delay={0.2}>
          <div className="mt-16 pt-8 border-t-[4px] border-[var(--color-text)]">
            <div className="flex flex-wrap gap-8">
              {[
                { value: "22.4%", label: "PPL Reduction" },
                { value: "3.9%", label: "Param Cost" },
                { value: "576", label: "Learned Directions" },
                { value: "≈ 0", label: "Cross-Layer Cosine Sim" },
                { value: "96%", label: "Domain Classification" },
              ].map((stat, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold font-mono tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.1em] font-bold">
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
