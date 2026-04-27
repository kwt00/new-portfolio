import { useState } from "react";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import { navigate } from "../lib/router";

interface Article {
  date: string;
  tag: string;
  title: string;
  abstract: string;
  href: string;
  accent: string;
  external?: boolean;
}

const articles: Article[] = [
  {
    date: "2026.04",
    tag: "Mechanistic Interpretability",
    title: "Iterative Alternating Training for MLP Transcoders",
    abstract:
      "A training method for MLP transcoders that converges in ~40 minutes (18.5x cheaper than end-to-end), produces features 2.78x more independent under random-feature ablation, and supports anchoring - dropping KL from 0.720 to 0.283 by leaving some layers as real MLPs.",
    href: "/transcoders",
    accent: "var(--color-violet)",
  },
  {
    date: "2026.03",
    tag: "Architecture / arXiv",
    title: "Directional Routing in Transformers",
    abstract:
      "A lightweight mechanism that gives each attention head learned suppression directions controlled by a shared router. 31-56% perplexity reduction at 3.9% parameter cost, with 576 directions self-organizing into orthogonal subspaces across layers.",
    href: "/directional-routing",
    accent: "var(--color-pink)",
  },
  {
    date: "2026",
    tag: "Pre-print",
    title: "N-gram Contract Completion",
    abstract:
      "A suffix-array + NER pipeline for contract blank classification. 305 learned parameters, 98.3% accuracy, 43x faster than GPT-5 few-shot - no neural network, no embeddings.",
    href: "/ngram-contracts",
    accent: "var(--color-teal)",
  },
];

const ArticleCard = ({ a }: { a: Article }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => navigate(a.href)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block w-full text-left border-t-[1.5px] border-[var(--color-border)] py-8 sm:py-10 transition-colors duration-200"
      data-cursor-hover
      style={{
        background: hover ? "var(--color-surface)" : "transparent",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)]">
          {a.date}
        </span>
        <span
          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: a.accent }}
        >
          {a.tag}
        </span>
      </div>
      <h3
        className="font-serif text-2xl sm:text-3xl md:text-[2.125rem] font-semibold leading-[1.15] tracking-[-0.01em] mb-3 transition-colors duration-200"
        style={{
          color: hover ? a.accent : "var(--color-text)",
          fontFamily: "var(--font-serif)",
        }}
      >
        {a.title}
      </h3>
      <p
        className="text-[var(--color-text-muted)] leading-[1.65] max-w-[640px] mb-4 text-[15px] sm:text-[16px]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {a.abstract}
      </p>
      <span
        className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-200"
        style={{ color: hover ? a.accent : "var(--color-text-muted)" }}
      >
        Read
        <span style={{ transform: hover ? "translateX(4px)" : "translateX(0)", transition: "transform 0.2s" }}>
          {"->"}
        </span>
      </span>
    </button>
  );
};

const WritingIndex = () => {
  return (
    <section id="writing" className="relative py-20 sm:py-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-[920px] mx-auto">
        <AnimatedContent distance={20} delay={0}>
          <div className="flex items-baseline gap-4 mb-12">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              01
            </span>
            <h2 className="font-serif text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.01em]">
              Writing
            </h2>
          </div>
        </AnimatedContent>
        <AnimatedContent distance={30} delay={0.05}>
          <div className="border-b-[1.5px] border-[var(--color-border)]">
            {articles.map((a) => (
              <ArticleCard key={a.href} a={a} />
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default WritingIndex;
