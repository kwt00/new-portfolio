const Footer = () => {
  return (
    <footer id="contact" className="relative py-10 sm:py-14 px-4 sm:px-8 md:px-12 border-t-[4px] border-[var(--color-text)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left — logo + copyright */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="text-base font-mono font-bold text-white bg-[var(--color-text)] border-[4px] border-[var(--color-text)] px-3 py-1"
            style={{ boxShadow: "3px 3px 0px var(--color-border)" }}
          >
            KT.
          </span>
          <span className="w-[4px] h-5 bg-[var(--color-text)]" />
          <span className="text-[12px] text-[var(--color-text-muted)] font-mono tracking-wider font-bold">
            © {new Date().getFullYear()} Kevin Taylor
          </span>
        </div>

        {/* Right — social links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href="https://github.com/kwt00"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--color-text)] font-mono tracking-wider font-bold border-[4px] border-[var(--color-text)] px-3 py-1 bg-[var(--color-surface)] transition-all duration-200 hover:bg-[var(--color-blue)] hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            style={{ boxShadow: "3px 3px 0px var(--color-border)" }}
            data-cursor-hover
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kevinwt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--color-text)] font-mono tracking-wider font-bold border-[4px] border-[var(--color-text)] px-3 py-1 bg-[var(--color-surface)] transition-all duration-200 hover:bg-[var(--color-teal)] hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            style={{ boxShadow: "3px 3px 0px var(--color-border)" }}
            data-cursor-hover
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/KevinTaylor00"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--color-text)] font-mono tracking-wider font-bold border-[4px] border-[var(--color-text)] px-3 py-1 bg-[var(--color-surface)] transition-all duration-200 hover:bg-[var(--color-pink)] hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            style={{ boxShadow: "3px 3px 0px var(--color-border)" }}
            data-cursor-hover
          >
            Twitter
          </a>
          <a
            href="mailto:kevin.taylor1924@gmail.com"
            className="text-[12px] text-[var(--color-text)] font-mono tracking-wider font-bold border-[4px] border-[var(--color-text)] px-3 py-1 bg-[var(--color-surface)] transition-all duration-200 hover:bg-[var(--color-violet)] hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            style={{ boxShadow: "3px 3px 0px var(--color-border)" }}
            data-cursor-hover
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
