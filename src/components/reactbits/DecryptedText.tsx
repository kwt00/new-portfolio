import { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  encrypted?: boolean;
  revealDirection?: "start" | "end" | "center";
  characters?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  className = "",
  revealDirection = "start",
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  parentClassName = "",
  animateOn = "view",
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let iteration = 0;
    const totalLength = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";

            let revealed = false;
            if (revealDirection === "start") revealed = index < iteration;
            else if (revealDirection === "end") revealed = index >= totalLength - iteration;
            else revealed = Math.abs(index - totalLength / 2) < iteration / 2;

            if (revealed) return char;
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > totalLength) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn !== "view") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          scramble();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn]);

  return (
    <span
      ref={containerRef}
      className={parentClassName}
      onMouseEnter={animateOn === "hover" ? scramble : undefined}
    >
      <span className={`font-mono ${className}`}>{displayText}</span>
    </span>
  );
};

export default DecryptedText;
