import { useState, useEffect } from "react";
import FlowField from "../components/reactbits/FlowField";
import MagneticParticleText from "../components/reactbits/MagneticParticleText";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Subtle flowing background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
        style={{ opacity: loaded ? 0.7 : 0 }}
      >
        <FlowField
          lineCount={32}
          speed={0.6}
          mouseInfluence={0.4}
          colors={["#e85d75", "#4a7ef5", "#8b5cf6", "#36c2b8", "#f28b3a"]}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Magnetic Particle Title */}
        <div
          className="h-[140px] md:h-[200px] lg:h-[260px] mb-10 transition-all duration-[1200ms] ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <MagneticParticleText
            text="Kevin Taylor"
            fontSize={130}
            particleDensity={3}
            colors={["#c45a3c", "#1e3a5f", "#2d1b69", "#1a1613"]}
            mouseRadius={90}
            mouseForce={0.9}
            springStiffness={0.035}
            damping={0.87}
            noiseAmount={1.5}
            particleSize={2.2}
            className="h-full"
          />
        </div>

        {/* Tagline */}
        <p
          className="text-center text-[1.125rem] sm:text-[1.375rem] md:text-[1.5rem] leading-[1.5] text-[var(--color-text-muted)] max-w-[640px] mx-auto transition-all duration-[1000ms] ease-out"
          style={{
            fontFamily: "var(--font-serif)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "350ms",
          }}
        >
          Growth Engineer at Cerebras. I write about mechanistic interpretability, LLM architecture, and other technical problems I find interesting.
        </p>

        {/* Tiny nav row */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 transition-all duration-[800ms] ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "550ms",
          }}
        >
          {[
            { label: "Writing", target: "writing" },
            { label: "Experience", target: "experience" },
            { label: "Contact", target: "contact" },
          ].map((l) => (
            <button
              key={l.target}
              onClick={() => document.getElementById(l.target)?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-text)] hover:text-[var(--color-pink)] transition-colors duration-200"
              data-cursor-hover
            >
              <span className="w-2 h-2 bg-[var(--color-text)] group-hover:bg-[var(--color-pink)] transition-colors duration-200" />
              {l.label}
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="flex justify-center mt-20 transition-all duration-[800ms] ease-out"
          style={{
            opacity: loaded ? 0.5 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "900ms",
          }}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-bold">
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
