import { useEffect, useRef, useState } from "react";

interface CustomCursorProps {
  color?: string;
  size?: number;
  trailSize?: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = "#2a2520",
  size = 12,
  trailSize = 36,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }

      const target = e.target as HTMLElement;
      const clickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsPointer(!!clickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const animateTrail = () => {
      trailPos.current.x += (pos.current.x - trailPos.current.x) * 0.15;
      trailPos.current.y += (pos.current.y - trailPos.current.y) * 0.15;

      if (trailRef.current) {
        trailRef.current.style.left = `${trailPos.current.x}px`;
        trailRef.current.style.top = `${trailPos.current.y}px`;
      }

      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000]"
        style={{
          width: isPointer ? size * 2.5 : size,
          height: isPointer ? size * 2.5 : size,
          borderRadius: "50%",
          backgroundColor: isPointer ? "var(--color-accent)" : color,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease, background-color 0.3s ease",
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: isPointer ? trailSize * 1.5 : trailSize,
          height: isPointer ? trailSize * 1.5 : trailSize,
          borderRadius: "50%",
          border: `1.5px solid ${isPointer ? "var(--color-accent)" : color}`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease, border-color 0.3s ease",
          opacity: isVisible ? 0.4 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
