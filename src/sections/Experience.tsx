import { useState, useMemo } from "react";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import SpotlightCard from "../components/reactbits/SpotlightCard";

interface Role {
  title: string;
  type: string;
  period: string;
  color: string;
  spotlightColor: string;
  bullets: string[];
}

const roles: Role[] = [
  {
    title: "Growth Engineer",
    type: "Full-time",
    period: "Jul 2025 - Present",
    color: "var(--color-pink)",
    spotlightColor: "rgba(232, 93, 117, 0.1)",
    bullets: [
      "Built core PAYGO and cloud-console features (referral system, promo logic, usage tracking)",
      "Debugged production model issues at launch, including context handling and tool-parsing failures",
      "Helped Growth launch Cerebras Code from 0 -> 1 and now building the Cerebras Code CLI",
    ],
  },
  {
    title: "Developer Relations Intern",
    type: "Part-time",
    period: "Feb 2025 - Jul 2025",
    color: "var(--color-blue)",
    spotlightColor: "rgba(74, 126, 245, 0.1)",
    bullets: [
      "Organized 15+ hackathons with partners like OpenRouter, Hugging Face, and Cline",
      "Created demo workflows and partner notebooks (Exa, LiveKit) used in model launches and conferences",
      "Built Cerebras inference integrations for major agent tools (Cline, RooCode, BrowserBase, etc)",
    ],
  },
  {
    title: "Marketing Intern",
    type: "Part-time",
    period: "Jan 2025 - Feb 2025",
    color: "var(--color-teal)",
    spotlightColor: "rgba(54, 194, 184, 0.1)",
    bullets: [
      "Grew the Cerebras support Discord from ~3k to 11k+ members",
      "Community usage driven through Discord correlated with ~$270k in new annual inference revenue",
    ],
  },
];

const Experience = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Compute tenure dynamically from Jan 2025 start date
  const tenure = useMemo(() => {
    const start = new Date(2025, 0); // Jan 2025
    const now = new Date();
    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months < 1) months = 1;
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs === 0) return `${mos} mo${mos !== 1 ? "s" : ""}`;
    return `${yrs} yr${yrs !== 1 ? "s" : ""} ${mos} mo${mos !== 1 ? "s" : ""}`;
  }, []);

  return (
    <section id="experience" className="relative py-20 sm:py-40 px-4 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <AnimatedContent distance={30} delay={0}>
          <div className="flex items-center gap-5 mb-6">
            <div
              className="border-[4px] border-[var(--color-text)] bg-[var(--color-orange)] px-4 py-1"
              style={{ boxShadow: "4px 4px 0px var(--color-text)" }}
            >
              <span className="text-white text-[13px] font-mono font-bold tracking-[0.2em] uppercase">
                Cerebras
              </span>
            </div>
            <span className="text-[var(--color-text-muted)] text-[13px] font-mono font-bold tracking-wider">
              {tenure}
            </span>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={30} delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-16">
            Experience
          </h2>
        </AnimatedContent>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-[4px] bg-[var(--color-border)]" />

          <div className="flex flex-col gap-6">
            {roles.map((role, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <AnimatedContent key={i} distance={30} delay={0.1 * (i + 1)}>
                  <div className="relative pl-14 md:pl-16">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-[7px] md:left-[11px] top-8 w-[26px] h-[26px] border-[4px] border-[var(--color-text)] transition-colors duration-200 z-10"
                      style={{
                        backgroundColor: isExpanded ? role.color : "var(--color-bg)",
                      }}
                    />

                    <SpotlightCard
                      className=""
                      spotlightColor={role.spotlightColor}
                    >
                      <div
                        className="p-8 md:p-10"
                        onClick={() => setExpandedIndex(isExpanded ? -1 : i)}
                        data-cursor-hover
                      >
                        {/* Header row */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3
                            className="text-xl md:text-2xl font-bold tracking-tight transition-colors duration-200"
                            style={{ color: isExpanded ? role.color : undefined }}
                          >
                            {role.title}
                          </h3>
                          <span
                            className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 border-[3px] transition-all duration-200"
                            style={{
                              borderColor: role.color,
                              color: isExpanded ? "white" : role.color,
                              backgroundColor: isExpanded ? role.color : "transparent",
                            }}
                          >
                            {role.type}
                          </span>
                        </div>

                        <span className="text-[12px] text-[var(--color-text-muted)] font-mono font-bold tracking-wider block mb-4">
                          {role.period}
                        </span>

                        {/* Expandable bullets */}
                        <div
                          className="overflow-hidden transition-all duration-500 ease-out"
                          style={{
                            maxHeight: isExpanded ? `${role.bullets.length * 100}px` : "0px",
                            opacity: isExpanded ? 1 : 0,
                          }}
                        >
                          <ul className="flex flex-col gap-3 pt-2">
                            {role.bullets.map((bullet, bi) => (
                              <li
                                key={bi}
                                className="flex items-start gap-3 text-[var(--color-text-muted)] text-sm leading-relaxed"
                                style={{
                                  transitionDelay: isExpanded ? `${bi * 80}ms` : "0ms",
                                  transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                                  opacity: isExpanded ? 1 : 0,
                                  transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                                }}
                              >
                                <span
                                  className="w-2 h-2 mt-1.5 shrink-0"
                                  style={{ backgroundColor: role.color }}
                                />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Expand indicator */}
                        <div className="flex items-center gap-2 mt-4">
                          <span
                            className="text-[11px] font-mono font-bold uppercase tracking-wider transition-colors duration-200"
                            style={{ color: role.color }}
                          >
                            {isExpanded ? "Collapse" : "Expand"}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 transition-transform duration-300"
                            style={{
                              color: role.color,
                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
