import { useEffect, useRef } from "react";

interface SquaresProps {
  direction?: "right" | "left" | "up" | "down" | "diagonal";
  speed?: number;
  squareSize?: number;
  borderColor?: string;
  hoverFillColor?: string;
  className?: string;
}

const Squares: React.FC<SquaresProps> = ({
  direction = "diagonal",
  speed = 0.5,
  squareSize = 40,
  borderColor = "#222",
  hoverFillColor = "#c8ff0015",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = { x: 0, y: 0 };
    let animId = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update offset
      const s = speed * 0.5;
      switch (direction) {
        case "right": offset.x += s; break;
        case "left": offset.x -= s; break;
        case "up": offset.y -= s; break;
        case "down": offset.y += s; break;
        case "diagonal": offset.x += s; offset.y += s; break;
      }

      const cols = Math.ceil(canvas.width / squareSize) + 2;
      const rows = Math.ceil(canvas.height / squareSize) + 2;

      const ox = ((offset.x % squareSize) + squareSize) % squareSize;
      const oy = ((offset.y % squareSize) + squareSize) % squareSize;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const x = c * squareSize + ox - squareSize;
          const y = r * squareSize + oy - squareSize;

          // Hover detection
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          if (mx >= x && mx <= x + squareSize && my >= y && my <= y + squareSize) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [direction, speed, squareSize, borderColor, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
};

export default Squares;
