import { useEffect } from "react";
import { navigate } from "../lib/router";
import TrainingCurve from "../components/research/TrainingCurve";
import EfficiencyBars from "../components/research/EfficiencyBars";
import DirectionSimilarity from "../components/research/DirectionSimilarity";
import LiveRoutingDemo from "../components/research/LiveRoutingDemo";
import ArchitectureDiagram from "../components/research/ArchitectureDiagram";
import SuppressionGeometry from "../components/research/SuppressionGeometry";
import LayerImportance from "../components/research/LayerImportance";
import LogitDecomposition from "../components/research/LogitDecomposition";

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
        className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-pink)] transition-colors duration-150"
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

const Formula = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 px-5 py-4 border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-[14px] leading-[1.7] text-[var(--color-text)] overflow-x-auto">
    {children}
  </div>
);

const DirectionalRoutingArticle = () => {
  useEffect(() => {
    document.title = "Directional Routing in Transformers - Kevin Taylor";

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

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id^='s']")
    ).filter((el) => /^s\d+$/.test(el.id));
    if (!sections.length) return;

    let raf = 0;
    const update = () => {
      const offset = 140;
      let active: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top - offset <= 0) active = el.id;
        else break;
      }
      if (active === "s1") active = null;

      if (active === null) {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
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
    <article className="relative min-h-screen pb-24" style={{ fontFamily: "var(--font-serif)" }}>
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

      <div className="max-w-[720px] mx-auto px-4 sm:px-8">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-6">
          Mechanistic Interpretability / Architecture
        </div>
        <h1 className="font-serif text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-semibold leading-[1.05] tracking-[-0.015em] text-[var(--color-text)] mb-8">
          Directional Routing in Transformers
        </h1>
        <p className="text-[1.25rem] sm:text-[1.375rem] leading-[1.55] text-[var(--color-text-muted)] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
          You can't unentangle superposition after the fact. But you can train a
          model to expose its own organization while it's learning. This is what
          came out of trying — a 433M-parameter decoder-only transformer with a
          small per-layer router that decides, based on the input, which
          directions in each attention head's output to suppress. What I wanted
          was a tool to study how circuits develop when superposition pressure
          is partially relaxed. What I got is exactly that — and a few things
          that surprised me.
        </p>
        <p className="text-[1.075rem] sm:text-[1.125rem] leading-[1.6] text-[var(--color-text-muted)] mb-10" style={{ fontFamily: "var(--font-serif)" }}>
          Pre-print on{" "}
          <a href="https://arxiv.org/abs/2603.14923" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pink)] underline decoration-[var(--color-pink)] decoration-[1.5px] underline-offset-[3px] hover:decoration-[2.5px] transition-all duration-150 font-semibold" data-cursor-hover>
            arXiv
          </a>
          . Checkpoints on HuggingFace at{" "}
          <code className="font-mono text-[0.95em] text-[var(--color-text)]">kevint00/moe-checkpoints</code>.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] pb-6 border-b-[1.5px] border-[var(--color-border)]">
          <span className="text-[var(--color-text)]">Kevin Taylor</span>
          <span className="text-[var(--color-border)]">/</span>
          <span>March 2026</span>
          <span className="text-[var(--color-border)]">/</span>
          <span>400M Decoder-only</span>
          <span className="text-[var(--color-border)]">/</span>
          <a href="https://arxiv.org/abs/2603.14923" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text)] hover:text-[var(--color-pink)] transition-colors duration-200 underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-pink)]" data-cursor-hover>
            Paper {"->"}
          </a>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-4 sm:px-8 text-[1.075rem] sm:text-[1.125rem] leading-[1.7] text-[var(--color-text)]" style={{ fontFamily: "var(--font-serif)" }}>
        {/* Section 1 */}
        <Section num="1" title="Where this came from">
          <p>
            The idea started when I was watching Neel Nanda's video walkthrough
            (
            <a href="https://www.youtube.com/watch?v=R3nbXgMnVqQ" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pink)] underline decoration-[1px] underline-offset-2 hover:decoration-[2px]">
              link
            </a>
            ) of a paper he worked on at Anthropic called{" "}
            <a href="https://transformer-circuits.pub/2022/toy_model/index.html" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pink)] underline decoration-[1px] underline-offset-2 hover:decoration-[2px]">
              Toy Models of Superposition
            </a>
            . He explained how MLP layers pack multiple features into the same
            neuron in a very careful, clever way. Mainly, this means
            overlapping representations that are hard to trigger together on
            accident. For example, talking about a bookstore and Count Dracula
            in the same sentence. The toy models in the paper formed the least
            similar superpositions they could.
          </p>
          <p>
            That was clever. It was also obviously efficient — superposition
            lets models hold way more knowledge than they have neurons for. But
            despite how clever the superposition got, it was still interfering
            with training that had already acted on the model. When the model
            processed math, the features that fired for math shared real estate
            with features that fired for prose. They had to coexist in the same
            parameters, the same neurons, the same activation patterns.{" "}
            <strong>
              Compression, no matter how good, never has higher fidelity than
              the original knowledge untouched.
            </strong>
          </p>
          <p>
            That bothered me, but the question I started with was a different
            one: could you take a dense, trained model and extract a specialist
            subnetwork from it? Like, what if you could pull a small, sharp
            coding model out of a big general-purpose one? Train a router on
            top, let it pick out the useful neurons, get a clean specialist on
            the cheap.
          </p>
          <p>This was somewhat effective, but not perfect.</p>
        </Section>

        {/* Section 2 */}
        <Section num="2" title="What didn't work">
          <p>
            The first version of this project was the obvious one. I took a
            trained dense transformer and stuck a router on top of it that
            looked at each input and decided which neurons in the FFN were
            useful for that token, that task. The rest got masked. What I was
            supposed to end up with was an input-dependent specialist extracted
            from the dense model — a kind of cheap dynamic distillation.
          </p>
          <p>
            It failed because superposition was naturally messy. The model had
            a tightly wrapped inner core that was all interconnected with
            itself. There was no way to separate overlapping representations.
          </p>
          <p>
            Useful features for code weren't living in some clean subset of
            neurons that the router could isolate. They were smeared across the
            same neurons that handled prose, factual recall, arithmetic,
            everything. Selecting a subset meant cutting through the middle of
            every superposition the model had worked hard to engineer. The
            specialist I got out was worse than the generalist I started with.
          </p>
          <p>
            <strong>
              Superposition is a structural property of the trained model. You
              can't undo it post-hoc by routing harder.
            </strong>{" "}
            You'd have to train a model where the pressure to superpose was
            different in the first place.
          </p>
          <p>Which is what the rest of this article is about.</p>
        </Section>

        {/* Section 3 */}
        <Section num="3" title="The pivot">
          <p>
            Instead of training a router on top of a dense model, I trained
            them both at once from scratch. The router and the transformer
            learned together, and the structure of the transformer got molded
            by the router during training.
          </p>
          <p>
            That's where the project became interesting, because what came out
            of joint training was not what I expected. The model self-organized
            in ways I didn't design. The router learned suppression patterns
            that were interpretable in plain English. The structure of the
            directions across layers ended up symmetric and clean in a way I
            wasn't aiming for. The most critical layer in the network turned
            out to be the least dynamic one. None of this was in the loss
            function.
          </p>
          <p>
            The architecture itself is small enough to describe in a paragraph,
            which I'll do next.
          </p>
        </Section>

        {/* Section 4 */}
        <Section num="4" title="How it works">
          <p>
            The base model was a normal 12-layer decoder-only transformer with
            about 400M parameters. RoPE positional encoding, SwiGLU MLP,
            RMSNorm, weight-tied embeddings. Pretty standard, as far as
            architectures go. The routing mechanism added 16M parameters on
            top of that — a ~3.9% overhead.
          </p>
          <p>
            Each attention head learned 4 unit-norm direction vectors in head
            space. Twelve layers × twelve heads × four directions gives 576
            directions total. These were the features the router could
            selectively suppress. They were tiny: a 73,728-parameter addition
            to the model.
          </p>
          <p>
            On top of every layer I put a router — a small 4-layer MLP that
            took a single input vector and produced 48 routing weights (one
            for each head × direction at this layer). The router input was the
            residual stream at this layer, mean-pooled across the sequence
            dimension.{" "}
            <strong>
              Mean-pooling is a fancy word for "take a long sequence of tokens
              and compact them into one vector that summarizes the whole
              sequence."
            </strong>{" "}
            The router needs a single input vector to make a single decision
            per layer; mean-pooling gives it that.
          </p>
          <p>
            The router emitted weights through a sigmoid scaled by a
            temperature of 5, which pushed the outputs toward binary 0/1
            decisions.{" "}
            <strong>
              A weight near 0 means "don't suppress this direction at all." A
              weight near 1 means "fully remove this direction's component
              from the head output."
            </strong>
          </p>
          <p>The actual suppression operation was a projection removal:</p>
          <Formula>
            o'<sub>h</sub> = o<sub>h</sub> − Σ<sub>k</sub> r<sub>h,k</sub> · (o
            <sub>h</sub> · d<sub>h,k</sub>) · d<sub>h,k</sub>
          </Formula>

          <Figure
            number="Figure 1"
            caption="One routed transformer block. A small per-layer router reads the mean-pooled residual stream, emits 48 sigmoid-temperature routing weights, and those weights selectively suppress directions in each attention head's output. The MLP runs untouched."
          >
            <ArchitectureDiagram />
          </Figure>

          <p>
            Standard attention ran first — Q, K, V projections, scaled
            dot-product, the usual. I got head outputs. Then the router's
            weights told the model how much of each direction to subtract
            from each head. After suppression, output projection ran and the
            modified attention output got added to the residual stream. MLP
            ran normally on top of that.
          </p>

          <Figure
            number="Figure 2"
            caption="The suppression operation in 2D. The head's output (blue) gets projected onto a learned direction (pink), and that projected component (orange) is subtracted from the output, scaled by the routing weight. Drag the slider to see r=0 (no change) through r=1 (full removal). Real space is 128-dim per head; collapsed here to 2D for intuition."
          >
            <SuppressionGeometry />
          </Figure>

          <p>
            Then the residual stream entered the next layer, with new content
            shaped by the previous layer's routing decision. That next layer
            had its own router, which saw the mean-pool of the residual
            stream as it now stood and decided its own suppression. Twelve
            layers, twelve routers, no router saw another router's decisions
            directly. They communicated through the residual stream.
          </p>
        </Section>

        {/* Section 5 */}
        <Section num="5" title="Training">
          <p>
            Both baseline (417M params, no routing) and routed (433M params)
            were trained from scratch on FineWeb sample-10BT. They both had
            identical hyperparameters and schedules: AdamW, cosine decay from
            3e-4 to 3e-5 with 500 warmup steps, weight decay 0.1. Micro-batch
            16, gradient accumulation 8, context length 1024 (about 131K
            tokens per step). 20K steps total, ~2.5B tokens. bfloat16. Routing
            parameters got 0.5× base learning rate because they otherwise
            overshoot.
          </p>
          <p>
            Hardware was 4× H100, DDP. Single seed (42). One run per model. No
            auxiliary routing loss, load-balancing objective, sparsity
            penalty, or special init for direction vectors.
          </p>

          <Figure
            number="Figure 3"
            caption="Training perplexity for routed and baseline models on FineWeb. The gap opened early and widened throughout training. Routed final PPL is roughly 80% of baseline at the same step count."
          >
            <TrainingCurve />
          </Figure>
        </Section>

        {/* Section 6 */}
        <Section num="6" title="What the routing learned">
          <p>The part I want to discuss is what those routing decisions encode.</p>
          <p>
            I took 24 held-out prompts split across math, code, prose, and
            factual content. I ran them through the trained model and recorded
            the routing weights at every layer × head × direction — that gave
            me a 576-dimensional vector per input, summarizing the model's
            per-input suppression decision. Then I ran nearest-centroid
            classification on those vectors with no training.{" "}
            <strong>
              23 out of 24 prompts were classified correctly by domain. 96%
              zero-shot accuracy.
            </strong>
          </p>
          <p>
            The router didn't have any explicit signal to learn domain
            identity. There was no domain label in the training data. The
            model was trained on next-token prediction like normal. But what
            came out was a per-input scalar pattern that you can read off the
            forward pass to recover what kind of input the model is
            processing. The routing weights were doing classification as a
            side effect of doing language modeling.
          </p>
          <p>
            That alone is interesting. What makes it more than interesting is
            the next layer down: the directions themselves are individually
            interpretable.
          </p>

          <Figure
            number="Figure 4"
            caption="Per-domain perplexity reduction (31-56%) and a small set of headline metrics from training. The PPL gains are real, but the routing patterns are what's actually being shown off."
          >
            <EfficiencyBars />
          </Figure>
        </Section>

        {/* Section 7 */}
        <Section num="7" title="The directions are readable">
          <p>
            Each of the 576 directions is a vector in head space. I projected
            each direction through the head's output matrix and through the
            LM head's unembedding matrix, and got a distribution over the
            vocabulary. The top tokens are usually a somewhat coherent
            concept.
          </p>
          <p>A few examples from the trained model:</p>
          <ul className="my-4 ml-6 list-disc text-[var(--color-text)] marker:text-[var(--color-text-muted)] space-y-2">
            <li>
              <strong>L11 H6 K0:</strong>{" "}
              <code className="font-mono text-[0.92em]">
                "and, And, Thus, However, In, AND, however"
              </code>{" "}
              — clearly an inter-clause-glue suppressor. When this direction
              gets weighted high, the model de-emphasizes connective words.
            </li>
            <li>
              <strong>L11 H11 K0:</strong>{" "}
              <code className="font-mono text-[0.92em]">
                ".\n, ."), )."
              </code>{" "}
              — a sentence terminator suppressor. Active near sentence
              boundaries.
            </li>
            <li>
              <strong>L5 H6 K0:</strong>{" "}
              <code className="font-mono text-[0.92em]">
                "Although, While, internal, Obviously, The, Actually"
              </code>{" "}
              — mid-layer logical-connective suppressor. Mostly relevant for
              transitional, contrastive constructions.
            </li>
            <li>
              <strong>L0 H4 K0:</strong> code-specific patterns — gets
              weighted high (0.63) on code prompts and low (0.44) on prose
              prompts.
            </li>
          </ul>
          <p>
            And these aren't post-hoc labels. The direction vectors live in
            the parameters, and interpretability is just a structural
            consequence.
          </p>
          <p>
            More than that, you can actually manipulate it. When I overrode
            the routing weight for the article-direction at inference and
            forced it to 1.0, P(article) in the next-token distribution
            dropped by 6.2%. That's causal control of behavior through a
            single scalar.
          </p>
        </Section>

        {/* Section 8 */}
        <Section num="8" title="The structure that emerged">
          <p>
            None of this was designed by me intentionally. The model
            self-organized into two qualitatively different regimes without
            any architectural pressure to do so.
          </p>
          <p>
            Early layers (L0-L3) became domain-adaptive specialists. Routing
            weights at these layers varied substantially across input
            distributions. Layer 0 had 10 specialist heads (out of 12).
            Routing variance across domains was high (0.070). PCA of the
            router's hidden states cleanly separated math, code, prose, and
            factual prompts into distinct clusters. Concrete: head L0H6
            suppressed with weight 0.59 on code prompts but 0.35 on factual
            prompts.
          </p>
          <p>
            Late layers (L7-L9) became fixed syntactic pruners. Routing
            weights here were nearly constant across inputs. Layer 9 had zero
            specialist heads and routing variance 0.00055 — 127× lower than
            layer 0. The directions at these layers, when projected through
            the unembedding, pointed at punctuation, articles, conjunctions,
            function words. Layer 9 also never fully suppressed anything; the
            max routing weight stayed below 0.9.
          </p>
          <p>
            Finally, layer 9 — the least dynamic layer in the model — turned
            out to be the most critical. Taking out only Layer 9's routing
            increased full-corpus perplexity by 42.6. No other single-layer
            ablation came anywhere close. The least adaptive, most "boring"
            layer was essential. Domain adaptation in early layers is useful;
            syntactic pruning in late layers is essential.
          </p>

          <Figure
            number="Figure 5"
            caption="Per-layer routing knockout. Layer 9 has the lowest routing variance (σ = 0.00055, 127× smaller than L0) but the largest knockout impact (+42.6 PPL). Hover any bar for details."
          >
            <LayerImportance />
          </Figure>

          <p>
            That ranking surprised me. I was expecting the dynamic layers to
            matter most because they were the obvious place where the router
            was doing visible work. The opposite turned out to be true: the
            router was doing visible work early because it was actively
            figuring out what to do. By late layers it had settled into a
            constant pruning pattern, and that pattern was what actually tied
            the predictions together.
          </p>
          <p>
            Additionally, across all 576 directions in all 12 layers, the
            cross-layer cosine similarity matrix was dominated by the
            diagonal. Each layer's directions were similar to themselves and
            almost orthogonal to every other layer's directions. Off-diagonal
            mean cosine similarity was μ = -0.0001. There was no
            orthogonality penalty in the loss. The model just decided, on its
            own, to carve out independent feature channels at every depth —
            which is mathematically symmetric and kind of a beautiful
            structure.
          </p>

          <Figure
            number="Figure 6"
            caption="Cross-layer cosine similarity of all 576 learned directions. Bright diagonal: each layer is self-similar. Cold off-diagonal: layers learned nearly orthogonal subspaces. No orthogonality penalty was in the loss."
          >
            <DirectionSimilarity />
          </Figure>
        </Section>

        {/* Section 9 */}
        <Section num="9" title="Routing is the load-bearing part">
          <p>
            One of the most interesting interpretability findings in this
            project came from just turning off the routing during inference.
            This doesn't require retraining — just a nullification of the
            routing weights at runtime.
          </p>
          <p>
            Perplexity went from 15 to roughly 7.7 million. The model was
            functionally destroyed. Even further, fully static weights like
            0.5 damaged performance too (PPL 5,284 — not as bad, but still
            bad). Dynamic routing alone held the model together.
          </p>
          <p>
            This itself isn't very interesting. Obviously it's load-bearing;
            it's part of the architecture. If you remove it, things break.
          </p>
          <p>
            The interesting result is what happened when I did the opposite
            ablation: turn routing on but knock out the individual attention
            heads that interpretability literature would normally identify
            as "the heads doing the work."
          </p>

          <Figure
            number="Figure 7"
            caption="Logit attribution to ' Paris' for the canonical 'The capital of France is →' prompt. Heads contribute -4.94 logits — they actively oppose the correct answer. Routing contributes +25.57 — it overrides the heads to produce the right answer."
          >
            <LogitDecomposition />
          </Figure>

          <p>
            The heads don't carry the circuit. The routing does. If you knock
            out the head with the strongest direct attention to "France" — the
            one standard interp methods would call the "mover head" —
            performance drops by 1.07× normal. The heads are interchangeable.
            The routing is what's load-bearing.
          </p>
          <p>
            This is unusual according to the standard mech-interp story. When
            researchers describe circuits, they usually identify a small
            number of specific heads that "carry" a computation. In the routed
            model, individual heads are mostly substitutable. The actual
            circuit is the per-input routing decision plus the
            generic-feeling heads' raw output.{" "}
            <strong>
              The router is the brain and the heads are just interchangeable
              hands.
            </strong>
          </p>
        </Section>

        {/* Section 10 */}
        <Section num="10" title="What this is for">
          <p>
            The point of the project is in the title above this paragraph.
            Directional routing is an interpretability tool. The model is
            organized in a way that exposes its own structure during
            inference. Pick any layer, any head, any direction, and you can
            tell me what it represents in plain English. Pick any input, any
            layer, and you can tell me what the model thinks the input is by
            reading the routing pattern. Modify any routing weight and you
            can causally steer the model's behavior on a token category.
          </p>
          <p>
            None of these operations is possible in a vanilla transformer.
            Vanilla heads have no explicit directional structure to project.
            There's no analogous per-input scalar control surface. There's no
            clean way to swap behavior between prompts. The standard interp
            toolkit (probes, SAEs, transcoders, activation patching) tries
            to extract this kind of structure from a model that wasn't
            designed to expose it. Directional routing puts the structure
            directly in the parameters.
          </p>
          <p>
            What I wanted from this project, going in, was a way to study
            superposition — just see what circuits look like when you reduce
            the pressure on the model to compress everything into the same
            neurons. The router lets features fire at different scales for
            different inputs, which is a form of relaxed superposition. The
            two-regime organization, the emergent orthogonality across
            layers, and the interpretability of individual directions are
            all things you can see because the architecture exposes them.
          </p>
          <p>
            The bigger pattern, which I want to keep working on:
            superposition is hard to undo from the outside, but you can
            train models that organize themselves in ways you can read off.
            Standard architectures don't expose enough of their organization
            to study cleanly. Architectures designed for interpretability,
            even imperfect, production-unfeasible ones like this, expose a
            lot more.
          </p>

          <Figure
            number="Figure 8"
            caption="Live routing simulator. Toggle between code, math, prose, and factual prompts to watch the 12-head × 12-layer routing pattern shift. Each pattern was extracted from a real forward pass on a held-out prompt."
          >
            <LiveRoutingDemo />
          </Figure>
        </Section>

        {/* Footer */}
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

export default DirectionalRoutingArticle;
