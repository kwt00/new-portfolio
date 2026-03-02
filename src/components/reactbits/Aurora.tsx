import { useEffect, useRef } from "react";

interface AuroraProps {
  colorStops?: string[];
  speed?: number;
  blur?: number;
  opacity?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#e85d75", "#5b8cf5", "#9b72f2", "#4ecdc4", "#f2994a"],
  speed = 1,
  blur = 120,
  opacity = 0.3,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const animate = () => {
      time += 0.003 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const blobs = colorStops.map((color, i) => ({
        x: canvas.width * (0.3 + 0.4 * Math.sin(time + i * 1.5)),
        y: canvas.height * (0.3 + 0.4 * Math.cos(time * 0.7 + i * 2)),
        radius: Math.min(canvas.width, canvas.height) * (0.3 + 0.1 * Math.sin(time * 0.5 + i)),
        color,
      }));

      blobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, blob.color + "88");
        gradient.addColorStop(1, blob.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colorStops, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ filter: `blur(${blur}px)`, opacity }}
    />
  );
};

export default Aurora;
