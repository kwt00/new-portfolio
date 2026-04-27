import { useState } from "react";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import DecryptedText from "../components/reactbits/DecryptedText";
import GradientText from "../components/reactbits/GradientText";
import StarBorder from "../components/reactbits/StarBorder";
import Magnet from "../components/reactbits/Magnet";

const socials = [
  { name: "GitHub", url: "https://github.com", icon: "GH", color: "var(--color-pink)" },
  { name: "LinkedIn", url: "https://linkedin.com", icon: "LI", color: "var(--color-blue)" },
  { name: "Twitter", url: "https://twitter.com", icon: "TW", color: "var(--color-violet)" },
  { name: "Dribbble", url: "https://dribbble.com", icon: "DR", color: "var(--color-teal)" },
];

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for reaching out! I'll get back to you soon.");
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-40 px-8 md:px-12 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label - thick bordered number */}
        <AnimatedContent distance={30} delay={0}>
          <div className="flex items-center gap-4 mb-16">
            <span
              className="text-[14px] tracking-[0.3em] uppercase font-mono font-bold px-4 py-1.5 border-[3px] border-[var(--color-orange)]"
              style={{ color: "var(--color-orange)" }}
            >
              03
            </span>
            <span className="w-14 h-[3px] bg-[var(--color-border)]" />
            <DecryptedText
              text="CONTACT"
              className="text-[14px] tracking-[0.3em] uppercase text-[var(--color-text-muted)] font-bold"
              speed={40}
            />
          </div>
        </AnimatedContent>

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28">
          {/* Left - info */}
          <div>
            <AnimatedContent distance={30} delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-[-0.02em] mb-10">
                Let's create{" "}
                <GradientText
                  colors={["#e85d75", "#f28b3a", "#8b5cf6", "#36c2b8", "#e85d75"]}
                  animationSpeed={4}
                  className="font-bold"
                >
                  something
                </GradientText>{" "}
                together.
              </h2>
            </AnimatedContent>

            <AnimatedContent distance={20} delay={0.2}>
              <p className="text-[var(--color-text-muted)] text-base leading-[1.8] mb-12">
                Have a project in mind? I'd love to hear about it. Whether it's a new
                website, a rebrand, or a full-stack application - let's talk.
              </p>
            </AnimatedContent>

            {/* Email - thick accent underline */}
            <AnimatedContent distance={20} delay={0.3}>
              <div className="mb-12">
                <span className="text-[12px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] block mb-3 font-bold">
                  Email
                </span>
                <a
                  href="mailto:hello@kevintaylor.dev"
                  className="text-[var(--color-text)] text-lg font-bold hover:text-[var(--color-orange)] transition-colors duration-300 border-b-[3px] border-[var(--color-border)] hover:border-[var(--color-orange)] pb-1"
                  data-cursor-hover
                >
                  hello@kevintaylor.dev
                </a>
              </div>
            </AnimatedContent>

            {/* Social icons - thick borders, filled on hover */}
            <AnimatedContent distance={20} delay={0.4}>
              <span className="text-[12px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] block mb-4 font-bold">
                Socials
              </span>
              <div className="flex gap-3">
                {socials.map((social, i) => (
                  <Magnet key={i} padding={40}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 border-[3px] border-[var(--color-border)] flex items-center justify-center text-[12px] font-mono font-bold text-[var(--color-text-muted)] transition-all duration-300"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = social.color;
                        e.currentTarget.style.backgroundColor = social.color;
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.color = "";
                      }}
                      data-cursor-hover
                    >
                      {social.icon}
                    </a>
                  </Magnet>
                ))}
              </div>
            </AnimatedContent>
          </div>

          {/* Right - form with thick borders */}
          <AnimatedContent distance={30} delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4 font-bold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-[3px] border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-pink)] focus:outline-none transition-colors duration-300 placeholder:text-[var(--color-border)] font-medium"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-[3px] border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-blue)] focus:outline-none transition-colors duration-300 placeholder:text-[var(--color-border)] font-medium"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[12px] font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4 font-bold">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b-[3px] border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-violet)] focus:outline-none transition-colors duration-300 resize-none placeholder:text-[var(--color-border)] font-medium"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit */}
              <StarBorder color="#e85d75" speed={5}>
                <button
                  type="submit"
                  className="w-full py-5 px-8 text-[var(--color-accent)] font-mono text-[12px] uppercase tracking-[0.25em] font-bold hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
                  data-cursor-hover
                >
                  Send Message
                </button>
              </StarBorder>
            </form>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};

export default Contact;
