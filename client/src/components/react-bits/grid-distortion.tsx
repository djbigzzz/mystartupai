import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GridDistortionProps {
  className?: string;
  gridSize?: number;
  distortionStrength?: number;
  color?: string;
  backgroundColor?: string;
  speed?: number;
}

export function GridDistortion({
  className = "",
  gridSize = 50,
  distortionStrength = 20,
  color = "rgba(139, 92, 246, 0.3)",
  backgroundColor = "transparent",
  speed = 0.001,
}: GridDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { offsetWidth, offsetHeight } = canvasRef.current.parentElement;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const cols = Math.ceil(dimensions.width / gridSize);
    const rows = Math.ceil(dimensions.height / gridSize);

    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      timeRef.current += speed;

      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          
          const distortX = Math.sin(timeRef.current + i * 0.3 + j * 0.2) * distortionStrength;
          const distortY = Math.cos(timeRef.current + i * 0.2 + j * 0.3) * distortionStrength;

          if (j === 0) {
            ctx.moveTo(x + distortX, y + distortY);
          } else {
            ctx.lineTo(x + distortX, y + distortY);
          }
        }
        ctx.stroke();
      }

      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const x = i * gridSize;
          const y = j * gridSize;
          
          const distortX = Math.sin(timeRef.current + i * 0.3 + j * 0.2) * distortionStrength;
          const distortY = Math.cos(timeRef.current + i * 0.2 + j * 0.3) * distortionStrength;

          if (i === 0) {
            ctx.moveTo(x + distortX, y + distortY);
          } else {
            ctx.lineTo(x + distortX, y + distortY);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, gridSize, distortionStrength, color, backgroundColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
