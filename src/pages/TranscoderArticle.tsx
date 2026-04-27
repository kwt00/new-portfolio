import { useEffect } from "react";
import { navigate } from "../lib/router";
import ConvergenceChart from "../components/transcoder/ConvergenceChart";
import FidelityChart from "../components/transcoder/FidelityChart";
import CascadeChart from "../components/transcoder/CascadeChart";
import VarianceExplainedChart from "../components/transcoder/VarianceExplainedChart";
import ErrorAmpChart from "../components/transcoder/ErrorAmpChart";
import AttentionCosineChart from "../components/transcoder/AttentionCosineChart";
import ComputeChart from "../components/transcoder/ComputeChart";
import E2EDiagram from "../components/transcoder/E2EDiagram";
import IterativeDiagram from "../components/transcoder/IterativeDiagram";

/**
 * TranscoderArticle - standalone /transcoders page.
 * Editorial / paper-style layout: serif body, narrow column,
 * inline figures at modest width, mono labels for chrome.
 */

interface FigureProps {
  number: string;
  caption: string;
  children: React.ReactNode;
}

const Figure = ({ number, caption, children }: FigureProps) => (
  <figure className="my-12">
    <div className="border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg)] p-3 sm:p-5">
      {children}
    </div>
    <figcaption className="mt-3 flex gap-3 text-[14px] leading-[1.55] text-[var(--color-text-muted)]">
      <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text)] pt-1">
        {number}
      </span>
      <span className="font-serif italic">{caption}</span>
    </figcaption>
  </figure>
);

interface SectionProps {
  num: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ num, title, children }: SectionProps) => (
  <section className="mt-16 mb-2 scroll-mt-24">
    <div className="flex items-baseline gap-3 mb-3">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Section {num}
      </span>
    </div>
    <h2 className="font-serif text-[1.875rem] sm:text-[2.125rem] font-semibold leading-[1.15] tracking-[-0.01em] mb-6 text-[var(--color-text)]">
      {title}
    </h2>
    <div className="space-y-5">{children}</div>
  </section>
);

const TranscoderArticle = () => {
  useEffect(() => {
    document.title =
      "Iterative Alternating Training for MLP Transcoders - Kevin Taylor";
    window.scrollTo(0, 0);
    return () => {
      document.title = "Kevin Taylor - Portfolio";
    };
  }, []);

  return (
    <article
      className="relative min-h-screen pb-24"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {/* Top utility bar */}
      <header className="border-b-[1.5px] border-[var(--color-border)] py-5 px-4 sm:px-8 mb-16 sm:mb-24">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)] hover:text-[var(--color-pink)] transition-colors duration-200"
            data-cursor-hover
          >
            {"<- Kevin Taylor"}
          </button>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Writing
          </span>
        </div>
      </header>

      {/* Title + lead */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-8">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-6">
          Mechanistic Interpretability / Pre-print
        </div>
        <h1 className="font-serif text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-semibold leading-[1.05] tracking-[-0.015em] text-[var(--color-text)] mb-8">
          Iterative Alternating Training for MLP Transcoders
        </h1>
        <p
          className="text-[1.25rem] sm:text-[1.375rem] leading-[1.55] text-[var(--color-text-muted)] mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          A new training method for MLP transcoders that drops compute from 739
          minutes to 51 minutes on a single RTX 3090, cuts feature entanglement
          by 1.89x, and stays compatible with real MLPs at inference - something
          end-to-end transcoders cannot do.
        </p>
        <p
          className="text-[1.075rem] sm:text-[1.125rem] leading-[1.6] text-[var(--color-text-muted)] mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Everything in this write-up is reproducible. Training scripts, the 12
          trained transcoders, evaluation pipelines, and the figure data live at{" "}
          <a
            href="https://github.com/kwt00/iterative-transcoders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-violet)] underline decoration-[var(--color-violet)] decoration-[1.5px] underline-offset-[3px] hover:decoration-[2.5px] transition-all duration-150 font-semibold"
            data-cursor-hover
          >
            github.com/kwt00/iterative-transcoders
          </a>
          .
        </p>

        {/* Byline */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] pb-6 border-b-[1.5px] border-[var(--color-border)]">
          <span className="text-[var(--color-text)]">Kevin Taylor</span>
          <span className="text-[var(--color-border)]">/</span>
          <span>April 2026</span>
          <span className="text-[var(--color-border)]">/</span>
          <span>GPT-2 Small</span>
          <span className="text-[var(--color-border)]">/</span>
          <a
            href="https://github.com/kwt00/iterative-transcoders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text)] hover:text-[var(--color-violet)] transition-colors duration-200 underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-violet)]"
            data-cursor-hover
          >
            Code {"->"}
          </a>
        </div>
      </div>

      {/* Body */}
      <div
        className="max-w-[720px] mx-auto px-4 sm:px-8 text-[1.075rem] sm:text-[1.125rem] leading-[1.7] text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {/* Section 1 */}
        <Section num="1" title="The interpretability problem">
          <p>
            MLP layers are critical to LLM functionality. Attention knows what
            to look at to generate an output, but the MLPs are responsible for
            turning that input into output - a core chunk of LLM intelligence
            hinges on MLPs. Interpreting MLP features can help researchers
            understand exactly how LLMs think through problems and perceive
            input.
          </p>
          <p>
            Unfortunately, MLPs are hard to interpret. During training, models
            learn to efficiently compress large amounts of data into a few
            parameters. This <em>superpositional feature encoding</em> is very
            effective for inference and training, because it requires less
            compute than designating functionality on a per-neuron basis, but
            it makes it difficult to interpret model behavior. One single
            neuron might play a role in arithmetic, factual recall, and
            creative writing. An observer would have difficulty proving which
            function the neuron is serving when it fires due to overlapping
            pathways.
          </p>
          <p>
            There is a helpful method for overcoming this:{" "}
            <strong>transcoders</strong>. Transcoders are trained on specific
            MLPs, but have many more parameters than the original component
            they're replacing. The idea is that if a transcoder fits the same
            input and output as a specific MLP layer, the features will be
            preserved. Since the transcoder has extra parameters, those
            features should be more cleanly separated and thus more
            interpretable than the original MLP.
          </p>
        </Section>

        {/* Section 2 */}
        <Section num="2" title="The end-to-end approach">
          <p>
            Current state-of-the-art transcoders train jointly end-to-end. Every
            MLP layer is replaced with a transcoder. Tokens pass through
            attention layer 0, then transcoder 0, then attention layer 1, then
            transcoder 1, and so on until the logits. Training treats each
            transcoder as if it were an MLP and computes loss against the
            original GPT-2 small model's logits. The gradient flows backward
            through every transcoder, and all 12 layers update simultaneously.
          </p>

          <Figure
            number="Schematic"
            caption="End-to-end joint training. A single backward pass updates all 12 transcoders against KL divergence with the original GPT-2 logits."
          >
            <E2EDiagram />
          </Figure>

          <p>
            This is useful because every transcoder gets to update depending on
            what every other transcoder is doing. Transcoder 3 learns not only
            how to approximate MLP 3, but also how to communicate effectively
            with transcoder 4 and how to handle input from transcoder 2.
          </p>
          <p>
            For GPT-2 small, end-to-end training takes about 20,000 steps with
            gradient accumulation 4 - roughly 80,000 effective passes through
            the entire model. On the RTX 3090 I used, that's{" "}
            <strong>739 minutes</strong>. GPU memory peaks above 4 GB because
            the system has to hold the full model's activations, every
            transcoder's activations, and the gradients. Layer-wise parallelism
            is impossible because the layers are tied together by the backward
            pass.
          </p>
          <p>
            In my testing, end-to-end achieves KL = 0.613 all-sparse -
            competitive fidelity. But the layers are specialized to each other.
            If you swap transcoder 4 for the real MLP 4, transcoder 5 receives
            an input distribution it has never seen, and the error spikes. KL
            jumps to 2.487.
          </p>
        </Section>

        {/* Section 3 */}
        <Section num="3" title="How iterative alternating training works">
          <p>
            The method starts with data collection. 500k MLP inputs/outputs are
            cached from the model run on common, domain-nonspecific datasets.
          </p>
          <p>
            Next, 12 transcoders are trained, one per layer, using simple MSE
            loss between the transcoder's output and the cached MLP output. No
            gradient flows through the full model, and no other transcoders are
            involved. Since each layer is a standalone regression problem, the
            training parallelizes trivially.
          </p>
          <p>
            But naively stringing these transcoders together at inference time
            produces a KL spike. Each transcoder was trained on the{" "}
            <em>real</em> MLP input distribution, not the shifted distribution
            it sees when other layers are also transcoders.
          </p>
          <p>
            To fix this, I modified GPT-2 so the transcoders plug into odd
            layers <code className="font-mono text-[0.95em]">{`{1, 3, 5, 7, 9, 11}`}</code>,
            leaving the even MLPs untouched. I ran this hybrid model on the
            cached activation data and recorded the actual input each layer
            receives (which is shifted because odd layers are now transcoders)
            along with the real even MLP's output on that shifted input. After
            retraining only the even transcoders on this new data, they are
            adapted to the world where odd layers are transcoders.
          </p>
          <p>
            Then I swapped the roles. Even layers were replaced with
            transcoders, and (shifted_input, real_mlp_output) pairs retrained
            the odd transcoders.
          </p>

          <Figure
            number="Schematic"
            caption="Iterative alternating training. One upfront data collection, then two rounds of MSE-fitting each parity group while the other is frozen. No backward pass through the full model."
          >
            <IterativeDiagram />
          </Figure>

          <Figure
            number="Figure 1"
            caption="Convergence across alternating rounds. Delta KL falls below 0.015 after two rounds, so two rounds is sufficient. Hover any point for the exact value."
          >
            <ConvergenceChart />
          </Figure>

          <p>
            Each iteration produces diminishing returns. After two alternating
            rounds, Delta KL drops below 0.015 - within noise.
          </p>
          <p>
            Total compute: <strong>51 minutes</strong> on the 3090, roughly
            14.5x cheaper than end-to-end. Peak memory: 1.2 GB, because the GPU
            either runs the model to collect data or trains a single
            transcoder, rather than holding the full model and all transcoders
            plus gradients at once.
          </p>
          <p>
            The transcoders you get from this process are each independently
            trained to match a real MLP. They have never seen each other's
            errors. When you swap any of them for the real MLP at inference
            time, the rest still work - in fact they work <em>better</em>,
            because you've removed a source of approximation error from an
            otherwise on-distribution pipeline. Anchoring 6 of 12 layers drops
            KL from 0.719 to 0.285. End-to-end cannot do this - not because it
            doesn't work, but because it does not optimize for the mathematical
            boundaries between layers.
          </p>
        </Section>

        {/* Section 4 fidelity */}
        <Section num="4" title="Fidelity">
          <p>
            All-sparse, iterative achieves KL = 0.719 and Top-1 = 55.8%.
            End-to-end achieves KL = 0.613 and Top-1 = 65.7%. End-to-end wins
            all-sparse fidelity by 17%. With anchoring (leaving 6 of 12 layers
            as real MLPs), iterative drops to KL = 0.285 and Top-1 = 71.2%.
            End-to-end under the same anchoring jumps to KL = 2.487 - worse
            than not using transcoders at all.
          </p>

          <Figure
            number="Figure 2"
            caption="Fidelity across all-sparse and anchored configurations. End-to-end wins all-sparse but breaks under anchoring. Hover any bar for the exact value."
          >
            <FidelityChart />
          </Figure>

          <p>
            The iterative method converges in two alternating rounds. Round 0
            trains all 12 transcoders independently on clean cached activations
            (KL = 0.862). Round 1 retrains the even layers on shifted data (KL
            = 0.778, Delta KL = +0.084). Round 2 retrains the odd layers (KL =
            0.720, Delta KL = +0.058). Rounds 3 and 4 produce changes below 0.015,
            within noise.
          </p>
          <p>
            End-to-end's 17% fidelity advantage is real, but fidelity alone
            does not determine whether transcoders are useful for
            interpretability. The following sections examine what that
            advantage actually consists of.
          </p>
        </Section>

        {/* Section 5 feature independence */}
        <Section num="5" title="Feature independence">
          <p>
            The purpose of transcoders is to discover which features at which
            layers contribute to model output. This requires feature isolation.
            If ablating one feature causes unpredictable changes everywhere
            downstream, you cannot trace circuits through individual features.
            A successful transcoder should be measured in part on how stable
            the model is during feature ablation.
          </p>
          <p>
            For each method, I took the 50 most active features at a given
            layer, zeroed each one individually, re-ran the model with all
            transcoders active, and measured the L2 disruption in feature
            activations at every downstream layer. I repeated this across 30
            prompts and averaged, testing at layers 2, 4, 6, 8, and 10.
          </p>

          <Figure
            number="Figure 3"
            caption="Single-feature ablations cascade 1.89x more in end-to-end transcoders than in iterative ones, with the gap widening at deeper layers. Hover any bar for the exact value."
          >
            <CascadeChart />
          </Figure>

          <p>
            End-to-end features produce <strong>1.89x more downstream
            disruption</strong> than iterative features when ablated. At layer
            2, iterative cascade is 349 versus end-to-end's 636. At layer 8,
            iterative is 99 versus end-to-end's 282 - a 2.84x ratio. The grand
            mean across all tested layers is 205.7 for iterative and 389.6 for
            end-to-end.
          </p>
          <p>
            Ablating a single end-to-end feature also causes 1.48x more change
            in output logits (mean logit delta: iterative 13.7, end-to-end
            20.2). End-to-end features are not independent units of computation
            - they are entangled with features at other layers. Iterative
            features are closer to independent, making them more suitable for
            the kind of one-at-a-time analysis that circuit discovery requires.
          </p>
        </Section>

        {/* Section 6 per-layer reconstruction */}
        <Section num="6" title="Per-layer reconstruction">
          <p>
            The cascade result raises a question: why are end-to-end features
            more entangled? The answer is that end-to-end transcoders do not
            approximate their target MLPs.
          </p>
          <p>
            I measured variance explained - the fraction of the real MLP's
            output variance each transcoder captures - on held-out activations
            for all 12 layers.
          </p>

          <Figure
            number="Figure 4"
            caption="Per-layer variance explained. Iterative is positive at every layer; end-to-end is deeply negative at 9 of 12. Bars beyond -200% are clipped with a triangle - hover for the actual value."
          >
            <VarianceExplainedChart />
          </Figure>

          <p>
            Iterative transcoders have positive variance explained at every
            layer, ranging from 42.2% at layer 5 to 98.3% at layer 2. They
            approximate their target MLPs, which means their features
            decompose the actual MLP computation into sparse components.
          </p>
          <p>
            End-to-end transcoders have <strong>negative variance explained at
            9 of 12 layers</strong>. Layer 4 is -848.7%. Layer 3 is -653.8%.
            Negative variance explained means the transcoder's output is
            further from the real MLP's output than a constant prediction
            would be. End-to-end transcoders produce outputs 2-3x the norm of
            the real MLP outputs. They are not modeling their target MLPs -
            they are producing oversized signals that cancel each other's
            errors at the output level.
          </p>
          <p>
            In other words: end-to-end transcoders match the original input
            and output from layer 0 to layer 11, but they take their own paths
            through the layers. The intermediate signals are not preserved.
          </p>
          <p>
            This explains the cascade finding. End-to-end features cascade more
            because each transcoder's output only makes sense in the context of
            every other transcoder compensating for it. Remove one feature and
            the compensation chain breaks. Iterative features cascade less
            because each transcoder independently approximates a real MLP, and
            removing a feature simply removes one component of that
            approximation without destabilizing unrelated layers.
          </p>
          <p>
            It also explains why end-to-end breaks under anchoring. Replacing
            an end-to-end transcoder with the real MLP introduces the correct
            signal where the model expects an oversized compensatory signal.
            The mismatch propagates and KL spikes to 2.487. Iterative
            transcoders, trained to match real MLPs, are compatible with real
            MLPs by construction.
          </p>
        </Section>

        {/* Section 7 error propagation + attention */}
        <Section num="7" title="Error propagation and attention">
          <p>
            I measured how transcoder errors propagate through the residual
            stream by computing the L2 delta between the original model's
            residual stream and the replacement model's at each layer.
          </p>

          <Figure
            number="Figure 5"
            caption="Residual-stream L2 error per layer (log scale). Iterative spikes early then plateaus; anchoring drops final-layer error 7x. Hover any point for exact magnitude."
          >
            <ErrorAmpChart />
          </Figure>

          <p>
            Iterative all-sparse shows a large spike at layer 2 (39x
            amplification), after which errors plateau through layers 3-10 and
            the residual stream self-corrects. With anchoring, the maximum
            delta drops 7x (from 4850 to 702 at layer 11). End-to-end all-sparse
            shows a smaller spike (4.5x at layer 2) and 4.7x less total error
            at the final layer than iterative, yet only 17% lower KL.
            LayerNorm and the unembedding absorb magnitude-level differences.
            The KL gap between the methods is driven by directional error,
            not norm.
          </p>
          <p>
            I also measured attention pattern preservation - the cosine
            similarity between original and replacement attention weights at
            each layer.
          </p>

          <Figure
            number="Figure 6"
            caption="Attention pattern cosine similarity. Both methods drop to 0.16-0.24 mid-model when all-sparse; anchoring restores iterative to 0.45-0.79. Hover any point for the exact cosine."
          >
            <AttentionCosineChart />
          </Figure>

          <p>
            Both methods produce near-orthogonal attention patterns at middle
            layers (cosine 0.16-0.24) when deployed all-sparse. This is a
            property of full MLP replacement, not specific to either method.
            Anchoring recovers attention cosine to 0.45-0.79 for iterative
            transcoders. The model is remarkably tolerant of large
            attention-pattern shifts while maintaining usable output
            distributions.
          </p>
        </Section>

        {/* Section 8 compute */}
        <Section num="8" title="Compute">
          <p>
            Iterative training takes approximately 51 minutes on a single
            RTX 3090 (data collection plus two alternating rounds). End-to-end
            takes 739 minutes. Iterative is <strong>18.5x cheaper</strong>.
            Peak GPU memory is 1.2 GB for iterative versus 4+ GB for
            end-to-end - a 3x reduction.
          </p>

          <Figure
            number="Figure 7"
            caption="Compute and memory comparison on log-scaled time. Each iterative layer is a standalone regression problem, so the method parallelizes - end-to-end cannot. Hover any point for full details."
          >
            <ComputeChart />
          </Figure>

          <p>
            Each layer in iterative training is a standalone regression
            problem, so the method is trivially parallel: with 12 GPUs,
            training drops to roughly 4 minutes. End-to-end cannot be
            parallelized this way - the backward pass couples all layers.
          </p>
        </Section>

        {/* Closing */}
        <Section num="9" title="Takeaway">
          <p>
            Iterative alternating training trades a 17% all-sparse fidelity
            gap for orders-of-magnitude better feature independence,
            compatibility with real MLPs, and dramatically lower compute. For
            interpretability work - which is the entire reason transcoders
            exist - those tradeoffs are obviously worth making.
          </p>
          <p>
            All training scripts, the 12 trained transcoders, evaluation code,
            and raw JSON behind every figure on this page are open-source at{" "}
            <a
              href="https://github.com/kwt00/iterative-transcoders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-violet)] underline decoration-[var(--color-violet)] decoration-[1.5px] underline-offset-[3px] hover:decoration-[2.5px] transition-all duration-150 font-semibold"
              data-cursor-hover
            >
              github.com/kwt00/iterative-transcoders
            </a>
            . Clone it, swap in a different base model, run the experiment yourself.
          </p>
        </Section>

        {/* End rule + back link */}
        <div className="mt-20 pt-8 border-t-[1.5px] border-[var(--color-border)] flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)] hover:text-[var(--color-pink)] transition-colors duration-200"
            data-cursor-hover
          >
            {"<- Back to Kevin Taylor"}
          </button>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            End
          </span>
        </div>
      </div>
    </article>
  );
};

export default TranscoderArticle;
