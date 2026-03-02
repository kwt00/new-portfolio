import { useEffect, useRef, useState } from "react";

interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  delay?: number;
  threshold?: number;
  duration?: number;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  distance = 60,
  direction = "vertical",
  reverse = false,
  delay = 0,
  threshold = 0.1,
  duration = 0.8,
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
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate(0, 0)";
    const d = reverse ? -distance : distance;
    if (direction === "horizontal") return `translate(${d}px, 0)`;
    return `translate(0, ${d}px)`;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
