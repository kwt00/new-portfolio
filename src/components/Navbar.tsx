import { useEffect, useState } from "react";
import Magnet from "./reactbits/Magnet";
import DecryptedText from "./reactbits/DecryptedText";

const navLinks = [
  { label: "About", href: "#about", num: "01", color: "var(--color-pink)" },
  { label: "Work", href: "#projects", num: "02", color: "var(--color-blue)" },
  { label: "Contact", href: "#contact", num: "03", color: "var(--color-orange)" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "py-4 bg-[var(--color-bg)]/90 backdrop-blur-md border-b-[3px] border-[var(--color-border)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-12 flex items-center justify-between">
          {/* Logo — bold mono, thick border box */}
          <Magnet padding={40}>
            <a
              href="#home"
              className="text-lg font-bold font-mono text-[var(--color-text)] hover:text-[var(--color-pink)] transition-colors duration-300 border-[3px] border-[var(--color-text)] hover:border-[var(--color-pink)] px-3 py-1"
              data-cursor-hover
            >
              <DecryptedText text="KT." speed={60} animateOn="hover" />
            </a>
          </Magnet>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Magnet key={i} padding={30}>
                <a
                  href={link.href}
                  className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-300 font-mono uppercase tracking-[0.15em] font-bold"
                  data-cursor-hover
                >
                  <span className="mr-1.5" style={{ color: link.color }}>
                    {link.num}
                  </span>
                  {link.label}
                </a>
              </Magnet>
            ))}
          </div>

          {/* Hamburger — fat lines */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-2 p-2"
            data-cursor-hover
            aria-label="Toggle menu"
          >
            <span
              className={`w-7 h-[3px] bg-[var(--color-text)] transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`w-7 h-[3px] bg-[var(--color-text)] transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`w-7 h-[3px] bg-[var(--color-text)] transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu — bold, colorful */}
      <div
        className={`fixed inset-0 z-[99] bg-[var(--color-bg)] flex flex-col items-center justify-center gap-14 transition-all duration-500 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-3xl font-bold text-[var(--color-text)] uppercase tracking-wider"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
            }}
          >
            <span
              className="text-sm font-mono mr-3 font-bold"
              style={{ color: link.color }}
            >
              {link.num}
            </span>
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;
