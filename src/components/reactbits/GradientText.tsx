interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  className?: string;
  animationSpeed?: number;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ["#e85d75", "#5b8cf5", "#9b72f2", "#4ecdc4", "#e85d75"],
  className = "",
  animationSpeed = 4,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `gradient-shift ${animationSpeed}s ease infinite`,
  };

  return (
    <>
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <span className={className} style={gradientStyle}>
        {children}
      </span>
    </>
  );
};

export default GradientText;
