import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Grotesque oversized arrow cursor - chunky, bold, editorial.
 * A blown-up version of the classic pointer with thick borders
 * that matches the neo-grotesque design system.
 */
// Detect touch / mobile once at module level
const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches);

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pos = useRef({ x: -100, y: -100 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
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
  }, []);

  useEffect(() => {
    // Don't attach anything on touch / mobile devices
    if (isTouchDevice) return;

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  // Skip rendering entirely on touch devices
  if (isTouchDevice) return null;

  const size = isPointer ? 38 : 32;
  const scale = isPressed ? 0.85 : 1;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none"
      style={{
        zIndex: 10000,
        width: size,
        height: size,
        // Anchor at tip (top-left corner of the arrow)
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        opacity: isVisible ? 1 : 0,
        transition:
          "width 0.2s cubic-bezier(0.23,1,0.32,1), height 0.2s cubic-bezier(0.23,1,0.32,1), transform 0.15s ease-out, opacity 0.15s ease",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow offset for depth */}
        <path
          d="M6 3L6 25L11.5 19.5L16.5 28L20.5 26L15.5 17L23 17L6 3Z"
          fill="var(--color-text)"
          transform="translate(1.5, 1.5)"
          opacity={0.2}
        />
        {/* Arrow body - filled with bg color, thick stroke */}
        <path
          d="M6 3L6 25L11.5 19.5L16.5 28L20.5 26L15.5 17L23 17L6 3Z"
          fill={isPointer ? "var(--color-accent)" : "var(--color-pink)"}
          stroke="var(--color-text)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            transition: "fill 0.2s ease",
          }}
        />
      </svg>
    </div>
  );
};

export default CustomCursor;
