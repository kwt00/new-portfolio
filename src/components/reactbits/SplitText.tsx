import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  threshold?: number;
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, transform: "translateY(40px)" },
  animationTo = { opacity: 1, transform: "translateY(0)" },
  threshold = 0.1,
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex mr-[0.3em]">
          {word.split("").map((char, ci) => {
            const currentIndex = letterIndex++;
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  opacity: isVisible ? animationTo.opacity : animationFrom.opacity,
                  transform: isVisible ? animationTo.transform : animationFrom.transform,
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                  transitionDelay: isVisible ? `${currentIndex * delay}ms` : "0ms",
                }}
                onTransitionEnd={() => {
                  if (currentIndex === text.replace(/ /g, "").length - 1) {
                    onLetterAnimationComplete?.();
                  }
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
