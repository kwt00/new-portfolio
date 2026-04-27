import { useRef, useState, useCallback, useEffect } from "react";

interface DraggableCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Draggable card with spring-back physics.
 * Drag it around - it snaps back to its origin with a bouncy spring.
 */
const DraggableCard: React.FC<DraggableCardProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const animFrame = useRef(0);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    setDragging(true);
    startPos.current = {
      x: e.clientX - currentOffset.current.x,
      y: e.clientY - currentOffset.current.y,
    };
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const newX = e.clientX - startPos.current.x;
    const newY = e.clientY - startPos.current.y;

    // Track velocity for fling
    velocity.current = {
      x: e.clientX - lastPos.current.x,
      y: e.clientY - lastPos.current.y,
    };
    lastPos.current = { x: e.clientX, y: e.clientY };

    currentOffset.current = { x: newX, y: newY };
    setOffset({ x: newX, y: newY });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);

    // Spring back animation with fling
    let vx = velocity.current.x * 2;
    let vy = velocity.current.y * 2;
    let x = currentOffset.current.x;
    let y = currentOffset.current.y;

    const spring = () => {
      // Spring force toward origin
      const fx = -x * 0.08;
      const fy = -y * 0.08;

      vx = (vx + fx) * 0.85; // damping
      vy = (vy + fy) * 0.85;

      x += vx;
      y += vy;

      if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5 && Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
        x = 0;
        y = 0;
        currentOffset.current = { x: 0, y: 0 };
        setOffset({ x: 0, y: 0 });
        return;
      }

      currentOffset.current = { x, y };
      setOffset({ x, y });
      animFrame.current = requestAnimationFrame(spring);
    };

    animFrame.current = requestAnimationFrame(spring);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  // Rotation based on drag direction
  const rotation = dragging
    ? Math.max(-8, Math.min(8, offset.x * 0.05))
    : offset.x * 0.03;

  return (
    <div
      ref={cardRef}
      className={`touch-none select-none ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
        transition: dragging ? "none" : undefined,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 50 : undefined,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
};

export default DraggableCard;
