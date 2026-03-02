interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  color?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  className = "",
  speed = 3,
  color = "rgba(200, 255, 0, 0.3)",
}) => {
  return (
    <>
      <style>{`
        @keyframes shiny-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <span
        className={className}
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 33%, ${color} 50%, transparent 66%)`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          animation: `shiny-text ${speed}s linear infinite`,
        }}
      >
        {children}
      </span>
    </>
  );
};

export default ShinyText;
