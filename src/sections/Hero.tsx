import { useState, useEffect } from "react";
import Magnet from "../components/reactbits/Magnet";
import FlowField from "../components/reactbits/FlowField";
import MagneticParticleText from "../components/reactbits/MagneticParticleText";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger staggered entrance after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Flowing wave mesh background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <FlowField
          lineCount={45}
          speed={1}
          mouseInfluence={0.6}
          colors={["#e85d75", "#4a7ef5", "#8b5cf6", "#36c2b8", "#f28b3a"]}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 md:px-12 max-w-5xl mx-auto">
        {/* Magnetic Particle Title — fades + slides up */}
        <div
          className="h-[140px] md:h-[200px] lg:h-[260px] mb-12 transition-all duration-[1200ms] ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <MagneticParticleText
            text="Developer"
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

        {/* CTAs — stagger after title */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* View Work — blue, hovers to pink */}
          <div
            className="transition-all duration-[800ms] ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transitionDelay: "400ms",
            }}
          >
            <Magnet padding={50}>
              <a
                href="https://github.com/kwt00"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-blue)] text-white text-[12px] font-mono uppercase tracking-[0.2em] font-bold border-[4px] border-[var(--color-text)] transition-all duration-200 hover:bg-[var(--color-pink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                style={{ boxShadow: "6px 6px 0px var(--color-text)" }}
                data-cursor-hover
              >
                View Work
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </Magnet>
          </div>
          {/* Get in Touch — teal, hovers to violet */}
          <div
            className="transition-all duration-[800ms] ease-out"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transitionDelay: "550ms",
            }}
          >
            <Magnet padding={50}>
              <a
                href="mailto:kevin.taylor1924@gmail.com"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-teal)] text-white text-[12px] font-mono uppercase tracking-[0.2em] font-bold border-[4px] border-[var(--color-text)] transition-all duration-200 hover:bg-[var(--color-violet)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                style={{ boxShadow: "6px 6px 0px var(--color-text)" }}
                data-cursor-hover
              >
                Get in Touch
              </a>
            </Magnet>
          </div>
        </div>

        {/* Scroll hint — fades in last */}
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
