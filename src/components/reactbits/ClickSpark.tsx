import { useCallback, useEffect, useRef } from "react";

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkSize?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  size: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = "#e85d75",
  sparkCount = 8,
  sparkSize = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animatingRef = useRef(false);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    sparksRef.current = sparksRef.current.filter((spark) => {
      spark.x += Math.cos(spark.angle) * spark.speed;
      spark.y += Math.sin(spark.angle) * spark.speed;
      spark.life -= 1;
      spark.speed *= 0.96;

      const alpha = spark.life / spark.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = sparkColor;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      return spark.life > 0;
    });

    if (sparksRef.current.length > 0) {
      requestAnimationFrame(animate);
    } else {
      animatingRef.current = false;
    }
  }, [sparkColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x: e.clientX,
        y: e.clientY,
        angle: (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5,
        speed: 3 + Math.random() * 4,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        size: sparkSize * (0.5 + Math.random() * 0.5),
      });
    }
    if (!animatingRef.current) {
      animatingRef.current = true;
      animate();
    }
  };

  return (
    <div onClick={handleClick} className="relative">
      {children}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />
    </div>
  );
};

export default ClickSpark;
