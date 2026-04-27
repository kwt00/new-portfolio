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
          A training method for MLP transcoders that converges in roughly 40
          minutes on a single RTX 3090 (18.5x less than end-to-end's 739 min),
          produces features 1.89x more independent in ablation cascade tests,
          and supports anchoring - leaving some layers as real MLPs at
          inference, where it drops KL from 0.720 to 0.283. End-to-end
          transcoders, by their training objective, do not.
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
            interpretable than the original MLP. The goal is{" "}
            <em>circuit discovery</em>: tracing which features at which layers
            are responsible for a model's behavior on specific inputs.
          </p>
          <p>
            Throughout this write-up, "all-sparse" means all 12 MLP layers are
            replaced with transcoders; attention layers are always frozen and
            unchanged.
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
            In my testing, end-to-end achieves KL = 0.613 all-sparse with Top-1
            match 65.7%. However, because E2E trains all transcoders as a
            coupled system, they only function together. Replacing transcoder 4
            with the real MLP 4 introduces an input distribution transcoder 5
            was never trained on. KL rises to 2.487. This is the expected
            behavior given E2E's training objective - not a flaw, but a
            constraint on how the transcoders can be deployed.
          </p>
        </Section>

        {/* Section 3 */}
        <Section num="3" title="How iterative alternating training works">
          <p>
            The method starts with data collection. 500k MLP inputs/outputs are
            cached from the original model run on OpenWebText (sequence length
            1024).
          </p>
          <p>
            Next, 12 transcoders are trained, one per layer, using simple MSE
            loss between the transcoder's output and the cached MLP output. No
            gradient flows through the full model, and no other transcoders are
            involved. Since each layer is a standalone regression problem, the
            training parallelizes trivially.
          </p>
          <p>
            However, trying to string them all together to transcode the full
            model results in <strong>KL = 0.862</strong> - poor fidelity. Each
            transcoder was trained on clean MLP inputs, but in joint deployment
            it receives shifted inputs from upstream transcoders.
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
            Each iteration produces diminishing returns. Round 1 retrains even
            layers on shifted data (KL = 0.778, Delta = +0.084). Round 2
            retrains odd layers (KL = 0.720, Delta = +0.058). Rounds 3 and 4
            change KL by less than 0.015 - within noise - so I stop at round 2.
          </p>
          <p>
            To validate that the alternating scheme specifically helps (rather
            than any form of retraining), I tested a non-alternating variant:
            plug all 12 transcoders in simultaneously and retrain each on the
            resulting shifted data. That produced KL = 0.729 - worse than
            alternating's 0.720. Alternating between even and odd subsets lets
            each group adapt to a partially-corrected environment rather than
            a fully-approximate one.
          </p>
          <p>
            Total compute: approximately <strong>40 minutes</strong> on the
            3090 (including 2 minutes for activation collection), about 18.5x
            cheaper than end-to-end. Peak memory: 1.2 GB, because the GPU
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
            KL from 0.720 +/- 0.002 to 0.283 +/- 0.001 (mean +/- std across 3
            seeds). E2E transcoders do not support this workflow because they
            were optimized as a coupled system, not for per-layer MLP
            approximation. This is a difference in capability, not a claim that
            E2E is broken - the two methods optimize different objectives and
            produce transcoders with different properties.
          </p>
        </Section>

        {/* Section 4 fidelity */}
        <Section num="4" title="Fidelity">
          <p>
            Before getting to the head-to-head numbers, it helps to anchor the
            scale. Replacing all 12 MLPs with zeros gives KL = 14.95.
            Replacing them with their per-layer mean activations gives KL =
            9.37. Random untrained transcoders give KL = 10.61. Both trained
            methods recover over 93% of the gap between random replacement and
            perfect fidelity, so this is a comparison between two strong
            approaches, not strong-vs-broken.
          </p>
          <p>
            All-sparse, iterative achieves <strong>KL = 0.720 +/- 0.002</strong>
            {" "}and Top-1 = 55.8% +/- 0.1% (mean +/- std across 3 seeds).
            End-to-end achieves KL = 0.613 and Top-1 = 65.7%. E2E has 17%
            lower KL and a 10-point higher Top-1 match rate. This is a real
            fidelity gap, and the paper's headline number is honest about it.
          </p>
          <p>
            With anchoring (leaving 6 of 12 layers as real MLPs at inference),
            iterative drops to <strong>KL = 0.283 +/- 0.001</strong> and Top-1
            = 71.3%. End-to-end under the same anchoring rises to KL = 2.487
            and Top-1 = 29.4%. Anchoring is a capability iterative supports
            and E2E does not - again, by training objective, not by accident.
            E2E transcoders are optimized as a coupled system; replacing any
            subset with real MLPs introduces inputs the remaining transcoders
            were not trained to handle.
          </p>
          <p>
            Anchoring is a real workflow, not a stunt. Researchers studying a
            specific layer's circuits often want that layer transcoded for
            interpretability while keeping the rest of the model untouched.
            Anthropic's circuit-tracing work uses partial replacement in
            exactly this way. For that workflow, iterative is the only viable
            option here.
          </p>

          <Figure
            number="Figure 2"
            caption="Fidelity across all-sparse and anchored configurations. E2E wins all-sparse; iterative supports anchoring. Hover any bar for the exact value."
          >
            <FidelityChart />
          </Figure>

          <p>
            E2E's 17% all-sparse fidelity advantage is real, and it shouldn't
            be hand-waved away. The next sections look at what that advantage
            actually consists of, and at the properties iterative training
            buys at the cost of those 17%.
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
          <p>
            Two caveats are worth being upfront about. First, the "50 most
            active" features are method-dependent: E2E and iterative do not
            share features, so this is comparing different feature sets. A
            matched-importance comparison (selecting features by their causal
            contribution to a fixed set of prompts) would be a stronger test.
            Second, higher cascade could in principle reflect feature{" "}
            <em>importance</em> rather than entanglement - a feature that
            participates in many circuits should cause large downstream
            changes when ablated. The consistency of the ratio across layers
            and the magnitude of the gap make pure-importance the unlikely
            full explanation, but it cannot be ruled out without a finer
            analysis that separates disruption to related vs. unrelated
            downstream features.
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
            would be. E2E outputs are 2-3x the norm of the real MLP outputs.
          </p>
          <p>
            This is the expected consequence of E2E's training objective.
            E2E transcoders are optimized to <em>collectively</em> produce
            correct logits, not to individually approximate MLPs. Each
            transcoder learns to produce outputs that, combined with all the
            others, cancel to the right answer. Individually, those outputs
            don't correspond to what the real MLP computes. They are valid
            solutions to the loss they were trained against - just not the
            same kind of object as a per-layer approximator.
          </p>
          <p>
            This explains the cascade finding. E2E features cascade more
            because each transcoder's output only makes sense in the context
            of every other transcoder compensating for it; remove one feature
            and the compensation chain breaks. Iterative features cascade
            less because each transcoder independently approximates a real
            MLP, and removing a feature removes one component of that
            approximation without destabilizing unrelated layers. It also
            explains why anchoring works for iterative and not E2E: the real
            MLP is on-distribution for iterative's downstream transcoders by
            construction, and off-distribution for E2E's by construction.
          </p>
          <p>
            For researchers who want transcoders whose features correspond to
            actual MLP computations - a natural requirement for circuit
            discovery - iterative training provides this property and E2E
            does not.
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
            Iterative training takes approximately 40 minutes on a single
            RTX 3090 (2 minutes for activation collection, plus the two
            alternating rounds). End-to-end takes 739 minutes. Iterative is
            {" "}<strong>18.5x cheaper</strong>. Peak GPU memory is 1.2 GB
            for iterative versus 4+ GB for end-to-end - a 3x reduction.
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

        {/* Section 9 discussion */}
        <Section num="9" title="Discussion">
          <p>
            E2E and iterative training optimize different objectives and
            produce transcoders with qualitatively different properties.
            Neither is strictly superior - the choice depends on the workflow.
          </p>
          <p>
            E2E produces transcoders optimized for collective output fidelity.
            It achieves 17% lower KL all-sparse, but its transcoders do not
            individually approximate their target MLPs, have 1.89x more
            feature co-dependence, and can't be deployed alongside real MLPs.
            For applications where all-sparse fidelity is the only concern
            and features will not be studied individually, E2E is the better
            choice.
          </p>
          <p>
            Iterative produces transcoders optimized for per-layer MLP
            approximation. Each transcoder's features correspond to
            components of the real MLP computation, feature effects are more
            localized, and transcoders can be mixed with real MLPs for higher
            fidelity at selected layers. For circuit discovery - where you
            need to trace individual features through the model and may want
            to study a subset of layers - iterative is the better choice, at
            18.5x lower cost.
          </p>
          <p>
            <strong>The fidelity gap is structural.</strong> I tried four
            ways to close it: vanilla E2E fine-tuning from an iterative warm
            start (KL diverged to 5.76), anchor-regularized fine-tuning
            (preserved modularity, didn't match E2E), MLP-matching
            regularized fine-tuning (KL diverged to 6.06), and retraining on
            the all-sparse deployment distribution (no improvement, KL =
            0.729). The gap reflects the same property the rest of this
            write-up is about: per-layer independence precludes the
            inter-layer error cancellation that E2E uses to achieve lower
            KL. It's a property of the objectives, not a flaw in the
            training procedure.
          </p>
        </Section>

        {/* Section 10 limitations */}
        <Section num="10" title="Limitations">
          <p>
            Several things this work does not do, said plainly.
          </p>
          <p>
            <strong>One model.</strong> All experiments are on GPT-2 small
            (124M parameters, 12 layers). The compute advantage should widen
            with model size - cost scales with one layer, not the whole
            model - but I have not demonstrated this. Scaling to Llama-scale
            models is the obvious next step.
          </p>
          <p>
            <strong>One corpus.</strong> Training is on OpenWebText.
            Distribution robustness is untested. Iterative training is more
            sensitive than E2E to the activation cache distribution because
            each transcoder only sees cached data, whereas E2E sees the full
            data distribution during joint training.
          </p>
          <p>
            <strong>Reimplementation E2E baseline.</strong> The E2E baseline
            is mine, not the published code from prior work. I match the
            architecture and hyperparameters described in the literature,
            but reimplementations may underperform published baselines.
          </p>
          <p>
            <strong>No downstream eval.</strong> Cascade, variance explained,
            and KL are proxies for interpretability, not interpretability
            itself. A direct evaluation - comparing the quality of circuits
            discovered using iterative vs E2E transcoders, or measuring
            feature monosemanticity via automated labeling - would
            strengthen the interpretability claim. This is the most
            important follow-up.
          </p>
          <p>
            <strong>Cascade test confound.</strong> Features are selected by
            method-specific activation magnitude, and higher cascade could
            in principle reflect feature importance rather than entanglement.
            A matched-importance or random-sampling variant would be a fairer
            comparison.
          </p>
          <p>
            <strong>Single-seed E2E.</strong> Iterative numbers are mean +/-
            std across 3 seeds (std at most 0.002 KL). E2E is reported from
            one seed - multi-seed E2E would strengthen the comparison but
            costs ~12 hours of GPU time per seed.
          </p>
        </Section>

        {/* Section 11 takeaway */}
        <Section num="11" title="Takeaway">
          <p>
            Iterative alternating training trades a 17% all-sparse fidelity
            gap for features that approximate their target MLPs, are 1.89x
            more independent under ablation, support anchoring, and cost
            18.5x less to train. For circuit discovery and other workflows
            that need to reason about individual features or mix transcoders
            with real MLPs, those tradeoffs are clearly worth making. For
            workflows that only care about all-sparse output fidelity and
            don't need to study features in isolation, E2E remains the
            better choice.
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
            . Clone it, swap in a different base model, run the experiment
            yourself.
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
