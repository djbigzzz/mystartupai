import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AuroraBackground({
  className = "",
  colors = [
    "rgba(139, 92, 246, 0.3)",
    "rgba(236, 72, 153, 0.3)",
    "rgba(59, 130, 246, 0.3)",
  ],
  speed = 0.002,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      timeRef.current += speed;

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      colors.forEach((color, index) => {
        const offset = index * (Math.PI * 2) / colors.length;
        
        const x = canvas.width / 2 + Math.sin(timeRef.current + offset) * (canvas.width * 0.3);
        const y = canvas.height / 2 + Math.cos(timeRef.current * 1.2 + offset) * (canvas.height * 0.3);
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.6);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
