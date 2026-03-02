import AnimatedContent from "../components/reactbits/AnimatedContent";
import BlurText from "../components/reactbits/BlurText";

const About = () => {
  return (
    <section id="about" className="relative py-40 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <AnimatedContent distance={30} delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-[-0.02em] mb-10">
              <BlurText
                text="I like building things that work."
                delay={50}
                animateBy="words"
                className="leading-[1.1]"
              />
            </h2>
          </AnimatedContent>

          <AnimatedContent distance={20} delay={0.2}>
            <p className="text-[var(--color-text-muted)] text-base leading-[1.8] mb-8">
              Freshman at UCLA studying computer science. Currently a Growth
              Engineer at Cerebras and President of{" "}
              <a
                href="https://www.midwaycollective.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue)] font-bold hover:text-[var(--color-pink)] transition-colors duration-200 underline underline-offset-2 decoration-2"
                data-cursor-hover
              >
                UCLA Midway Ventures
              </a>
              , part of the national Midway Collective for technology.
            </p>
          </AnimatedContent>

          <AnimatedContent distance={20} delay={0.3}>
            <p className="text-[var(--color-text-muted)] text-base leading-[1.8] mb-12">
              I learn by shipping. Hackathons, research papers, products — whatever
              gets me closer to understanding how things actually work. Published
              in IntelliSys and arXiv, built a patent-pending geolocation system, and
              made an accessibility tool that lets amputees control a computer
              hands-free.
            </p>
          </AnimatedContent>

          {/* Role badges */}
          <AnimatedContent distance={20} delay={0.4}>
            <div className="flex flex-wrap gap-3">
              <div
                className="inline-flex items-center gap-3 px-5 py-2.5 border-[4px] border-[var(--color-text)] bg-[var(--color-pink)] transition-all duration-200"
                style={{ boxShadow: "5px 5px 0px var(--color-text)" }}
              >
                <span className="w-3 h-3 bg-white" />
                <span className="text-[12px] text-white font-mono uppercase tracking-[0.15em] font-bold">
                  Cerebras
                </span>
              </div>
              <a
                href="https://www.midwaycollective.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-2.5 border-[4px] border-[var(--color-text)] bg-[var(--color-blue)] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                style={{ boxShadow: "5px 5px 0px var(--color-text)" }}
                data-cursor-hover
              >
                <span className="w-3 h-3 bg-white" />
                <span className="text-[12px] text-white font-mono uppercase tracking-[0.15em] font-bold">
                  Midway Ventures
                </span>
              </a>
              <div
                className="inline-flex items-center gap-3 px-5 py-2.5 border-[4px] border-[var(--color-text)] bg-[var(--color-teal)] transition-all duration-200"
                style={{ boxShadow: "5px 5px 0px var(--color-text)" }}
              >
                <span className="w-3 h-3 bg-white" />
                <span className="text-[12px] text-white font-mono uppercase tracking-[0.15em] font-bold">
                  UCLA CS '28
                </span>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};

export default About;
