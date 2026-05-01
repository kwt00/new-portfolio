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
  <figure className="my-14">
    <div className="border-[1.5px] border-[var(--color-border)] bg-[var(--color-bg)] px-4 sm:px-6 pt-4 sm:pt-6 pb-5 sm:pb-7">
      {children}
    </div>
    <figcaption className="mt-4 flex gap-3 text-[14px] leading-[1.6] text-[var(--color-text-muted)] px-1">
      <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text)] pt-[3px]">
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
  <section id={`s${num}`} className="mt-16 mb-2 scroll-mt-24">
    <div className="flex items-baseline gap-3 mb-3">
      <a
        href={`#s${num}`}
        className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-violet)] transition-colors duration-150"
        data-cursor-hover
      >
        Section {num}
      </a>
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

    // On mount: scroll to hash if present, else top.
    const hash = window.location.hash.slice(1);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      document.title = "Kevin Taylor - Portfolio";
    };
  }, []);

  // Scroll spy: rewrite #hash in the URL to the section nearest the top.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id^='s']")
    ).filter((el) => /^s\d+$/.test(el.id));
    if (!sections.length) return;

    let raf = 0;
    const update = () => {
      const offset = 140; // px from top counted as "in view"
      let active: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top - offset <= 0) active = el.id;
        else break;
      }
      // Section 1 is the implicit top of the article - no hash until s2.
      if (active === "s1") active = null;

      if (active === null) {
        if (window.location.hash) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }
      } else {
        const want = `#${active}`;
        if (window.location.hash !== want) {
          window.history.replaceState(null, "", want);
        }
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
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
          minutes on a single RTX 3090 (18.5x less than end-to-end's 739
          min), is essentially deterministic across seeds (KL coefficient
          of variation under 0.3% vs ~31% for end-to-end), produces
          features that cascade 2-3x less under three independent
          feature-selection schemes, and supports anchoring - leaving some
          layers as real MLPs at inference, where it drops KL from 0.720
          to 0.283 across all 3 seeds. End-to-end transcoders, by their
          training objective, do not.
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
            Each iteration produced diminishing returns. Round 1 retrained
            even layers on shifted data (KL = 0.778, Delta = +0.084). Round 2
            retrained odd layers (KL = 0.720, Delta = +0.058). Rounds 3 and 4
            changed KL by less than 0.015 - within noise - so I stopped at
            round 2.
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
            Why this works comes down to what each transcoder is being
            optimized for. Iterative makes every transcoder an independent
            sparse bottleneck whose only job is to approximate one specific
            MLP layer's input-output map. There is no external pressure to
            coordinate with neighbors, no inter-layer error budget to draw
            from, no compensation to learn. Each transcoder has to actually
            solve its own per-layer compression problem on its own. That
            single-objective bottleneck is what makes the resulting features
            correspond to MLP computations: there's no other valid solution
            to per-layer MSE except actually approximating the MLP.
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
            approximation. <strong>This is a difference in capability, not a
            claim that E2E is broken - the two methods optimize different
            objectives and produce transcoders with different properties.
            </strong>
          </p>
        </Section>

        {/* Section 4 fidelity */}
        <Section num="4" title="Fidelity">
          <p>
            For scale: replacing all 12 MLPs with zeros gives KL = 14.95.
            Replacing them with per-layer mean activations gives KL = 9.37.
            Random untrained transcoders give KL = 10.61. Both methods here
            recover over 93% of the gap between random replacement and
            perfect fidelity.
          </p>
          <p>
            Across 3 seeds, iterative all-sparse averaged{" "}
            <strong>KL = 0.720 +/- 0.002</strong> and Top-1 = 55.8% +/-
            0.1%. Across 3 seeds, E2E all-sparse averaged{" "}
            <strong>KL = 0.426 +/- 0.134</strong> and Top-1 = 73.7% +/-
            5.7%. On the mean number, E2E compresses the model's output
            distribution harder than iterative does. On reproducibility,
            iterative's coefficient of variation on KL is under 0.3% -
            essentially deterministic - while E2E's is around 31%. The
            three E2E seeds spanned 0.32 to 0.61, suggesting substantial
            run-to-run variance, though three samples don't pin down the
            full distribution.
          </p>
          <p>
            With anchoring (leaving 6 of 12 layers as real MLPs at
            inference), iterative dropped to <strong>KL = 0.283 +/- 0.001
            </strong> and Top-1 = 71.3%. E2E under the same anchoring
            averaged <strong>KL = 2.591 +/- 0.115</strong> across all 3
            seeds (2.49, 2.53, 2.75) - all three broken in the same way,
            well above the iterative-anchored point and worse than several
            of the degenerate baselines. The all-sparse comparison is
            seed-dependent; the anchoring comparison is not. Anchoring
            failure being consistent across seeds is what you would
            expect from "E2E learns to compensate as a coupled system":
            breaking the coupling propagates regardless of which seed
            produced it.
          </p>
          <p>
            E2E's anchoring failure is a property of the training objective,
            not a flaw to be fixed: E2E transcoders are optimized as a
            coupled system, so replacing any subset with real MLPs
            introduces inputs the remaining transcoders were not trained to
            handle.
          </p>
          <p>
            Anchoring is a real workflow, not a stunt. Researchers studying a
            specific layer's circuits often want that layer transcoded for
            interpretability while keeping the rest of the model untouched.
            Lindsey et al. (2025) use partial MLP replacement in Anthropic's
            circuit-tracing work on Claude. For that workflow, iterative is
            the only viable option here.
          </p>

          <Figure
            number="Figure 2"
            caption="Fidelity across all-sparse and anchored configurations. Both methods reported as mean across 3 seeds. Iterative supports anchoring; E2E does not. Hover any bar for the exact value."
          >
            <FidelityChart />
          </Figure>

          <p>
            E2E's better mean all-sparse KL is real. So is its 67x larger
            seed variance. The rest of this write-up looks at properties
            that are stable across seeds and that bear on circuit-discovery
            workflows: feature independence, per-layer geometry, error
            propagation, anchoring, and compute. On those, the two methods
            are not close.
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
            For each method I zeroed out a single feature at a single layer,
            re-ran the model with all transcoders active, and measured the
            L2 disruption in feature activations at every downstream layer.
            This was averaged across 30 prompts at layers 2, 4, 6, 8, and 10.
          </p>
          <p>
            I ran this test under three feature-selection schemes. The
            first selected the 50 most active features per layer
            (method-dependent). The second selected 50 random features per
            layer with the same random seed for both methods
            (method-independent, controls for activation magnitude). The
            third selected features at the same importance percentile
            across methods, where a feature's importance was its mean
            ablation effect on output logits (matched-importance, controls
            for whether E2E's features are systematically more
            load-bearing). Defining importance as logit-effect rather than
            activation magnitude or attribution is what makes the test
            method-symmetric: both methods are scored by the same downstream
            quantity, so the percentile bin doesn't favor either training
            objective.
          </p>

          <Figure
            number="Figure 3"
            caption="Ablation cascade across three feature-selection schemes. All three agree iterative features are 2-3x less entangled than E2E features. Toggle between selection methods. Hover any bar for the exact value."
          >
            <CascadeChart />
          </Figure>

          <p>
            All three selection schemes agreed that E2E features were more
            entangled. Under most-active, iterative features produced{" "}
            <strong>1.89x less downstream disruption</strong> than E2E
            (grand mean: 205.7 vs 389.6). Under random with matched seed,
            the ratio grew to <strong>2.78x</strong> (grand mean: 31.1 vs
            86.3). Under matched-importance, the ratio was{" "}
            <strong>2.48x</strong> (grand mean: 36.0 vs 89.1). The
            entanglement gap survived every variant of the test I could
            think of.
          </p>
          <p>
            One caveat: the test starts at layer 2 because layers 0 and 1
            don't have enough downstream depth to measure cascade cleanly.
            Beyond that, every confound I could identify - method-dependent
            feature popularity, mismatched activation magnitude, mismatched
            feature importance - was tested for and the ratio held.
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
            would be.
          </p>
          <p>
            To characterize what E2E transcoders actually compute, I measured
            the cosine similarity and norm ratio between each E2E
            transcoder's output and the real MLP output on held-out data. At{" "}
            <strong>mid-layers (1-8)</strong>, E2E outputs are nearly
            orthogonal to the real MLP outputs (cosine 0.05-0.13) at 2-4x
            the norm. They are not anti-correlated with the real MLP - they
            point in essentially unrelated directions at inflated scale. At{" "}
            <strong>edge layers (0, 10, 11)</strong>, cosine recovers to
            0.43-0.65 and norms are closer to correct.
          </p>
          <p>
            This is the expected consequence of E2E's training objective.
            E2E transcoders are optimized to <em>collectively</em> produce
            correct logits, not to individually approximate MLPs. Each
            transcoder learns to produce outputs that, combined with all the
            others, cancel to the right answer. Individually, mid-layer
            outputs bear almost no geometric relationship to the real MLP
            computation. They are valid solutions to the loss they were
            trained against - just not the same kind of object as a
            per-layer approximator.
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
            Iterative all-sparse showed a large spike at layer 2 (39x
            amplification), after which errors plateaued through layers
            3-10 as the residual stream self-corrected. With anchoring, the
            maximum delta dropped 7x (from 4850 to 702 at layer 11).
            End-to-end all-sparse showed a smaller spike (4.5x at layer 2)
            and 4.7x less total error at the final layer than iterative.
            E2E achieves substantially lower mean KL despite only modestly
            smaller residual error because LayerNorm and the unembedding
            absorb magnitude-level differences - what survives is
            directional error.
          </p>
          <p>
            This connects directly to the geometric story from the previous
            section. E2E's mid-layer outputs are nearly orthogonal to the
            real MLP at 2-4x the norm, but the model recovers the right
            <em> direction </em>in residual space through inter-layer
            cancellation - each transcoder's wrong-direction signal is
            offset by the next one's. Iterative gives up that cancellation
            by construction, accepting larger residual error in exchange
            for per-layer geometric fidelity. The two sections measure the
            same tradeoff from different angles.
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
            Both methods produced near-orthogonal attention patterns at
            middle layers (cosine 0.16-0.24) when deployed all-sparse - a
            property of full MLP replacement, not specific to either method.
            Anchoring recovered attention cosine to 0.45-0.79 for iterative
            transcoders. The model turned out to be remarkably tolerant of
            large attention-pattern shifts while still producing usable
            output distributions.
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
            problem, so the method is embarrassingly parallel across layers.
            With multi-GPU parallelism, training time approaches the serial
            activation-collection floor of ~2 minutes. End-to-end cannot be
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
            E2E produces transcoders optimized for collective output
            fidelity. Mean all-sparse KL across 3 seeds is 0.426 - lower
            than iterative's 0.720 - but std is 0.134, 67x larger than
            iterative's 0.002. Its transcoders do not individually
            approximate their target MLPs, features have 2-3x more
            co-dependence under every cascade test I ran, and they can't
            be deployed alongside real MLPs. For applications where
            high-variance all-sparse fidelity is the only concern and
            features will not be studied individually, E2E is still a
            reasonable choice.
          </p>
          <p>
            Iterative produces transcoders optimized for per-layer MLP
            approximation. KL is reproducible across seeds (std 0.002),
            features correspond to components of the real MLP computation,
            feature effects are more localized (2-3x less cascade across
            three feature-selection schemes), and transcoders can be mixed
            with real MLPs for higher fidelity at selected layers. For
            circuit discovery - where you need to trace individual features
            through the model and may want to study a subset of layers -
            these tradeoffs are likely worth making, at 18.5x lower cost.
          </p>
          <p>
            I also tried to push iterative <em>up</em> toward E2E's mean
            fidelity. Fine-tuning iterative transcoders end-to-end from a
            warm start diverged catastrophically (KL &gt; 5.0). Retraining
            iterative on the all-sparse deployment distribution produced
            no improvement. Together with the geometric and cascade
            findings, those failures are evidence that iterative's
            modularity is paid for: matching E2E's mean fidelity seems to
            require giving up the per-layer independence that makes
            iterative's features tractable for circuit discovery in the
            first place.
          </p>
        </Section>

        {/* Section 10 limitations */}
        <Section num="10" title="Limitations">
          <p>
            Several things this work does not do, said plainly.
          </p>
          <p>
            <strong>Single sparsity setting.</strong> All results use one
            architecture (6,144 features, top-128). The geometric story
            from section 6 and the cascade story from section 5 both
            depend on properties that could shift at different expansion
            factors or sparsity levels - the variance-explained advantage
            and the 2-3x entanglement gap have not been re-measured at
            other settings.
          </p>
          <p>
            <strong>No downstream eval.</strong> Cascade, variance
            explained, and KL are proxies for interpretability, not
            interpretability itself. The interpretability claim rests on
            those proxies; circuit-level analysis or automated
            monosemanticity labeling would test it directly, and neither
            is done here.
          </p>
          <p>
            <strong>One model.</strong> All experiments are on GPT-2 small
            (124M parameters, 12 layers). The compute advantage should
            widen with model size - cost scales with one layer, not the
            whole model - but I have not demonstrated this.
          </p>
          <p>
            <strong>One corpus.</strong> Training is on OpenWebText.
            Distribution robustness is untested. Iterative training is
            more sensitive than E2E to the activation cache distribution
            because each transcoder only sees cached data, whereas E2E
            sees the full data distribution during joint training.
          </p>
          <p>
            <strong>Reimplementation E2E baseline.</strong> The E2E
            baseline is mine, not the published code from prior work. I
            match the architecture and hyperparameters described in the
            literature, but reimplementations may underperform published
            baselines.
          </p>
        </Section>

        {/* Section 11 takeaway */}
        <Section num="11" title="Takeaway">
          <p>
            E2E's mean all-sparse KL (0.426) is lower than iterative's
            (0.720), but its per-run outcome varies substantially across
            seeds (CV ~31% vs iterative's under 0.3%). Iterative trades
            that mean-fidelity edge for features that approximate their
            target MLPs, are 2-3x more independent under every cascade
            test I ran (most-active 1.89x, random 2.78x, matched-importance
            2.48x), support anchoring (KL = 0.283 vs E2E's 2.59 across all
            3 seeds), reproduce across seeds, and cost 18.5x less to
            train. For circuit discovery and other workflows that need to
            reason about individual features or mix transcoders with real
            MLPs, those tradeoffs are likely worth making. For workflows
            that only care about all-sparse output fidelity and don't need
            reproducibility or feature-level analysis, E2E is still a
            reasonable choice.
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
