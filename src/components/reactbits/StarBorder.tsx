import { type CSSProperties, type ElementType } from "react";

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: number;
  as?: ElementType;
  [key: string]: unknown;
}

const StarBorder: React.FC<StarBorderProps> = ({
  children,
  className = "",
  color = "#e85d75",
  speed = 4,
  as: Component = "div",
  ...props
}) => {
  const style: CSSProperties = {
    "--star-color": color,
    "--star-speed": `${speed}s`,
  } as CSSProperties;

  return (
    <>
      <style>{`
        @keyframes star-border-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .star-border-container {
          position: relative;
          overflow: hidden;
        }
        .star-border-container::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: conic-gradient(from 0deg, transparent, var(--star-color), transparent 30%);
          animation: star-border-rotate var(--star-speed) linear infinite;
        }
        .star-border-container::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: var(--color-surface, #ebe4db);
        }
      `}</style>
      <Component
        className={`star-border-container ${className}`}
        style={style}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </Component>
    </>
  );
};

export default StarBorder;
