import { useState } from "react";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import DecryptedText from "../components/reactbits/DecryptedText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import TiltedCard from "../components/reactbits/TiltedCard";
import GradientText from "../components/reactbits/GradientText";

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  year: string;
  accent: string;
  accentRaw: string;
  spotlightColor: string;
}

const projects: Project[] = [
  {
    title: "Nebula Dashboard",
    description:
      "Real-time analytics with interactive 3D data visualizations and a refined dark interface.",
    tags: ["React", "Three.js", "D3", "TypeScript"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    link: "#",
    year: "2026",
    accent: "var(--color-pink)",
    accentRaw: "#e85d75",
    spotlightColor: "rgba(232, 93, 117, 0.1)",
  },
  {
    title: "Synthwave Store",
    description:
      "E-commerce platform with immersive product showcases and buttery smooth transitions.",
    tags: ["Next.js", "Stripe", "Prisma", "TailwindCSS"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    link: "#",
    year: "2025",
    accent: "var(--color-blue)",
    accentRaw: "#4a7ef5",
    spotlightColor: "rgba(74, 126, 245, 0.1)",
  },
  {
    title: "Motion Studio",
    description:
      "Creative agency site with physics-based scroll animations and WebGL transitions.",
    tags: ["GSAP", "WebGL", "Framer Motion", "React"],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
    link: "#",
    year: "2025",
    accent: "var(--color-violet)",
    accentRaw: "#8b5cf6",
    spotlightColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    title: "Pulse Social",
    description:
      "Real-time social platform with live feeds and AI-powered content recommendations.",
    tags: ["React Native", "Firebase", "Node.js", "AI/ML"],
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
    link: "#",
    year: "2024",
    accent: "var(--color-teal)",
    accentRaw: "#36c2b8",
    spotlightColor: "rgba(54, 194, 184, 0.1)",
  },
];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-40 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section label - thick bordered number */}
        <AnimatedContent distance={30} delay={0}>
          <div className="flex items-center gap-4 mb-16">
            <span
              className="text-[14px] tracking-[0.3em] uppercase font-mono font-bold px-4 py-1.5 border-[3px] border-[var(--color-blue)]"
              style={{ color: "var(--color-blue)" }}
            >
              02
            </span>
            <span className="w-14 h-[3px] bg-[var(--color-border)]" />
            <DecryptedText
              text="WORK"
              className="text-[14px] tracking-[0.3em] uppercase text-[var(--color-text-muted)] font-bold"
              speed={40}
            />
          </div>
        </AnimatedContent>

        {/* Section heading */}
        <AnimatedContent distance={30} delay={0.1}>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.1] mb-20">
            Projects that{" "}
            <GradientText
              colors={["#e85d75", "#4a7ef5", "#8b5cf6", "#36c2b8", "#e85d75"]}
              animationSpeed={4}
              className="font-bold"
            >
              speak volumes
            </GradientText>
          </h2>
        </AnimatedContent>

        {/* 2-column grid with thick dividers */}
        <div className="grid md:grid-cols-2 gap-[3px] bg-[var(--color-border)]">
          {projects.map((project, i) => (
            <AnimatedContent key={i} distance={30} delay={0.08 * (i + 1)}>
              <TiltedCard maxTilt={5} scale={1.02} perspective={1000}>
                <SpotlightCard
                  className="group h-full"
                  spotlightColor={project.spotlightColor}
                >
                  <a
                    href={project.link}
                    className="block p-8 md:p-10"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    data-cursor-hover
                  >
                    {/* Image - thick border on hover */}
                    <div
                      className="relative overflow-hidden mb-8 aspect-video bg-[var(--color-bg-secondary)] border-[3px] transition-colors duration-300"
                      style={{
                        borderColor:
                          hoveredIndex === i ? project.accent : "var(--color-border)",
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {/* Gradient veil */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent transition-opacity duration-500"
                        style={{ opacity: hoveredIndex === i ? 0.05 : 0.3 }}
                      />
                      {/* Year badge - bright accent fill */}
                      <span
                        className="absolute top-0 right-0 px-4 py-2 text-[12px] font-mono uppercase tracking-wider font-bold text-white"
                        style={{ backgroundColor: project.accent }}
                      >
                        {project.year}
                      </span>
                    </div>

                    {/* Title + arrow */}
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <h3
                        className="text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300"
                        style={{
                          color:
                            hoveredIndex === i ? project.accent : undefined,
                        }}
                      >
                        {project.title}
                      </h3>
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-1.5 text-[var(--color-text-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        style={{
                          color:
                            hoveredIndex === i ? project.accent : undefined,
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M7 17L17 7M17 7H7M17 7v10"
                        />
                      </svg>
                    </div>

                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tags - thick borders, filled accent on hover */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="px-3 py-1.5 text-[11px] font-mono border-[3px] uppercase tracking-wider font-bold transition-all duration-300"
                          style={
                            hoveredIndex === i
                              ? {
                                  borderColor: project.accent,
                                  backgroundColor: project.accent,
                                  color: "#fff",
                                }
                              : {
                                  borderColor: "var(--color-border)",
                                  color: "var(--color-text-muted)",
                                }
                          }
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </SpotlightCard>
              </TiltedCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
