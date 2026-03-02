import { useEffect, useRef } from "react";

interface ASCIITextProps {
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  asBackground?: boolean;
}

const ASCII_CHARS = " .:-=+*#%@";

const ASCIIText: React.FC<ASCIITextProps> = ({
  text,
  fontSize = 6,
  color = "#c8ff00",
  backgroundColor = "transparent",
  className = "",
  asBackground = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      // Draw the text big and bold on a temp canvas
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = width;
      tmpCanvas.height = height;
      const tmpCtx = tmpCanvas.getContext("2d");
      if (!tmpCtx) return;

      const textFontSize = Math.min(width / (text.length * 0.55), height * 0.7);
      tmpCtx.fillStyle = "#fff";
      tmpCtx.font = `bold ${textFontSize}px 'Space Grotesk', sans-serif`;
      tmpCtx.textAlign = "center";
      tmpCtx.textBaseline = "middle";
      tmpCtx.fillText(text, width / 2, height / 2);

      // Read pixel data and convert to ASCII
      const imageData = tmpCtx.getImageData(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px 'Space Mono', monospace`;

      for (let y = 0; y < height; y += fontSize) {
        for (let x = 0; x < width; x += fontSize * 0.6) {
          const i = (y * width + x) * 4;
          const brightness = imageData.data[i]; // just red channel
          if (brightness > 20) {
            const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
            ctx.fillText(ASCII_CHARS[charIndex], x, y);
          }
        }
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [text, fontSize, color, backgroundColor]);

  return (
    <div
      ref={containerRef}
      className={`${asBackground ? "absolute inset-0" : "relative"} ${className}`}
      style={{ minHeight: asBackground ? undefined : "120px" }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ASCIIText;
