import { useEffect } from "react";
import { navigate } from "../lib/router";
import NgramResearch from "../sections/NgramResearch";

const NgramPage = () => {
  useEffect(() => {
    document.title = "N-gram Contract Completion - Kevin Taylor";
    window.scrollTo(0, 0);
    return () => {
      document.title = "Kevin Taylor - Portfolio";
    };
  }, []);

  return (
    <article className="relative min-h-screen pb-24">
      <header className="border-b-[1.5px] border-[var(--color-border)] py-5 px-4 sm:px-8 mb-12 sm:mb-16">
        <div className="max-w-[920px] mx-auto flex items-center justify-between">
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

      <NgramResearch />

      <div className="max-w-[920px] mx-auto mt-16 pt-8 px-4 sm:px-8 border-t-[1.5px] border-[var(--color-border)] flex items-center justify-between">
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
    </article>
  );
};

export default NgramPage;
