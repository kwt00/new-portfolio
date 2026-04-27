import AnimatedContent from "../components/reactbits/AnimatedContent";
import ModelComparison from "../components/ngram/ModelComparison";
import ParamsVsAccuracy from "../components/ngram/ParamsVsAccuracy";
import TemplateHeatmap from "../components/ngram/TemplateHeatmap";
import NgramSummary from "../components/ngram/NgramSummary";

/**
 * NgramResearch section - interactive visualizations for the n-gram
 * contract blank classifier paper. 305 parameters, matches GPT-5.
 *
 * 1. Model comparison bars (the money shot)
 * 2. Params vs accuracy (the absurdity gap)
 * 3. Per-template heatmap (detailed breakdown)
 * 4. Triple summary (accuracy, latency, cost)
 */
const NgramResearch = () => {
  return (
    <section id="ngram-research" className="relative py-20 sm:py-40 px-4 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="mb-6">
            <span className="text-[11px] font-mono font-bold text-[var(--color-teal)] uppercase tracking-[0.2em]">
              Research
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.1]">
              N-gram Content{" "}
              <span className="text-[var(--color-text-muted)]">Completion</span>
            </h2>
            <span
              className="shrink-0 self-start px-3 py-1.5 border-[3px] border-[var(--color-text)] bg-[var(--color-surface)] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)] select-none"
              style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
            >
              Paper Coming Soon
            </span>
          </div>
          <p className="text-[var(--color-text-muted)] text-base leading-[1.8] max-w-2xl mb-20">
            A suffix-array + NER pipeline for contract blank classification.
            305 learned parameters, 98.3% accuracy, 43x faster than GPT-5 few-shot
            - no neural network, no embeddings. Just n-grams and structure.
          </p>
        </AnimatedContent>

        {/* Row 1: Model Comparison + Params vs Accuracy */}
        <div className="grid md:grid-cols-2 gap-10 mb-20 items-stretch">
          {/* Model Comparison */}
          <AnimatedContent distance={30} delay={0.1} className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-teal)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                01
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Model Comparison
              </h3>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
              Six baselines from random guess to GPT-5 few-shot, plus two ablation
              variants of our own pipeline. Our full system takes the top spot at
              98.3% accuracy.
            </p>
            <div className="flex-1">
              <ModelComparison />
            </div>
          </AnimatedContent>

          {/* Params vs Accuracy */}
          <AnimatedContent distance={30} delay={0.15} className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-orange)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                02
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Params vs Accuracy
              </h3>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-6">
              Parameters versus accuracy on a log scale. Our 305-parameter model
              matches GPT-5 accuracy - orders of magnitude fewer parameters,
              same result.
            </p>
            <div className="flex-1">
              <ParamsVsAccuracy />
            </div>
          </AnimatedContent>
        </div>

        {/* Row 2: Per-Template Heatmap (full width) */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="mb-20">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-pink)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                03
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                Per-Template Breakdown
              </h3>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] sm:ml-auto px-2.5 py-1 border-[2px] border-[var(--color-text)] bg-[var(--color-violet)] text-white"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                Interactive
              </span>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-8 max-w-xl">
              Accuracy across 12 contract templates (bill of sale, NDA, lease, etc.)
              and 5 model configurations. Hover any cell for details.
            </p>
            <TemplateHeatmap />
          </div>
        </AnimatedContent>

        {/* Row 3: Summary Triple */}
        <AnimatedContent distance={30} delay={0.1}>
          <div className="mb-0">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="px-2.5 py-1 border-[3px] border-[var(--color-text)] bg-[var(--color-blue)] text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ boxShadow: "2px 2px 0px var(--color-text)" }}
              >
                04
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                The Full Picture
              </h3>
            </div>
            <p className="text-[var(--color-text-muted)] text-[14px] leading-[1.8] mb-8 max-w-xl">
              Three axes that matter: accuracy, speed, and cost. All numbers
              use the few-shot configuration for GPT models (their best accuracy).
            </p>
            <NgramSummary />
          </div>
        </AnimatedContent>

        {/* Summary strip */}
        <AnimatedContent distance={20} delay={0.2}>
          <div className="mt-16 pt-8 border-t-[4px] border-[var(--color-text)]">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              {[
                { value: "305", label: "Parameters" },
                { value: "98.3%", label: "Accuracy" },
                { value: "43x", label: "Faster than GPT-5" },
                { value: "$0", label: "API Cost" },
                { value: "12/12", label: "Templates Covered" },
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

export default NgramResearch;
