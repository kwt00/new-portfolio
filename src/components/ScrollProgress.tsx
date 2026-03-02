import { useEffect, useState } from "react";

/**
 * Bold scroll progress bar — fills left-to-right across the top of the viewport.
 * Cycles through accent colors as you scroll deeper.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Color transitions through the palette as you scroll
  const colors = [
    [74, 126, 245],   // blue
    [139, 92, 246],    // violet
    [232, 93, 117],    // pink
    [242, 139, 58],    // orange
    [54, 194, 184],    // teal
  ];

  const getColor = (t: number) => {
    const pos = t * (colors.length - 1);
    const i = Math.floor(pos);
    const f = pos - i;
    const c1 = colors[Math.min(i, colors.length - 1)];
    const c2 = colors[Math.min(i + 1, colors.length - 1)];
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[5px] bg-transparent">
      <div
        className="h-full transition-[width] duration-75"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: getColor(progress),
          boxShadow: `0 0 12px ${getColor(progress)}, 0 0 4px ${getColor(progress)}`,
        }}
      />
    </div>
  );
};

export default ScrollProgress;
