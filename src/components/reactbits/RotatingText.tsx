import { useEffect, useState } from "react";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 2500,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <span
        className="inline-block transition-all duration-300 ease-out"
        style={{
          transform: isAnimating ? "translateY(-100%)" : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
        }}
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
};

export default RotatingText;
