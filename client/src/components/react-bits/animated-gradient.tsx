import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
  blur?: number;
}

export function AnimatedGradient({
  className = "",
  colors = ["#8b5cf6", "#ec4899", "#3b82f6"],
  speed = 5,
  blur = 100,
}: AnimatedGradientProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, speed * 10);

    return () => clearInterval(interval);
  }, [speed]);

  const gradientStyle = {
    background: `linear-gradient(${rotation}deg, ${colors.join(", ")})`,
    filter: `blur(${blur}px)`,
  };

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none opacity-50 transition-all duration-1000",
        className
      )}
      style={gradientStyle}
    />
  );
}
