import { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "letters";
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 100,
  animateBy = "words",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className={animateBy === "words" ? "mr-[0.3em]" : ""}
          style={{
            display: "inline-block",
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(12px)",
            transform: isVisible ? "translateY(0)" : "translateY(8px)",
            transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: isVisible ? `${i * delay}ms` : "0ms",
          }}
        >
          {item === " " ? "\u00A0" : item}
        </span>
      ))}
    </div>
  );
};

export default BlurText;
