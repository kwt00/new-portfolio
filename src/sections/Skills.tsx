import AnimatedContent from "../components/reactbits/AnimatedContent";
import DecryptedText from "../components/reactbits/DecryptedText";
import Squares from "../components/reactbits/Squares";

const skillCategories = [
  {
    title: "Frontend",
    color: "var(--color-pink)",
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Three.js"],
  },
  {
    title: "Backend",
    color: "var(--color-blue)",
    skills: ["Node.js", "Python", "PostgreSQL", "GraphQL", "Redis", "Docker"],
  },
  {
    title: "Design",
    color: "var(--color-violet)",
    skills: ["Figma", "Adobe Suite", "Motion Design", "Prototyping", "UI/UX", "Branding"],
  },
  {
    title: "Tools",
    color: "var(--color-teal)",
    skills: ["Git", "AWS", "Vercel", "CI/CD", "Testing", "Agile"],
  },
];


const Skills = () => {
  return (
    <section id="skills" className="relative py-40 px-8 md:px-12 overflow-hidden">
      {/* Squares background - very subtle, diagonal movement */}
      <Squares
        direction="diagonal"
        speed={0.2}
        squareSize={60}
        borderColor="#ddd5ca"
        hoverFillColor="rgba(155, 114, 242, 0.03)"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <AnimatedContent distance={30} delay={0}>
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-violet)] font-mono font-bold">
              03
            </span>
            <span className="w-12 h-px bg-[var(--color-border)]" />
            <DecryptedText
              text="SKILLS"
              className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-text-muted)]"
              speed={40}
            />
          </div>
        </AnimatedContent>

        {/* Heading + description */}
        <AnimatedContent distance={30} delay={0.1}>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Tech Stack
          </h2>
          <p className="text-[var(--color-text-muted)] text-base leading-[1.8] mb-20 max-w-lg">
            A curated toolkit refined through years of building digital products
            that push boundaries.
          </p>
        </AnimatedContent>

        {/* 4-column grid with 1px grid-line pattern */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)]">
          {skillCategories.map((category, i) => (
            <AnimatedContent key={i} distance={30} delay={0.08 * (i + 1)}>
              <div className="p-8 bg-[var(--color-surface)] h-full group transition-colors duration-500 hover:bg-[var(--color-surface-hover)]">
                {/* Category title with square dot */}
                <h3
                  className="text-[11px] font-mono uppercase tracking-[0.2em] mb-8 flex items-center gap-3"
                  style={{ color: category.color }}
                >
                  <span
                    className="w-2 h-2 flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.title}
                </h3>
                {/* Skill list with pipe markers */}
                <div className="flex flex-col gap-4">
                  {category.skills.map((skill, si) => (
                    <div
                      key={si}
                      className="flex items-center gap-3 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"
                      style={{ transitionDelay: `${si * 40}ms` }}
                    >
                      <span className="w-px h-3 bg-[var(--color-border)] flex-shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

      </div>

    </section>
  );
};

export default Skills;
