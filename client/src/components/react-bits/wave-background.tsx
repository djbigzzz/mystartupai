import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveBackgroundProps {
  className?: string;
  waveColor?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  numberOfWaves?: number;
}

export function WaveBackground({
  className = "",
  waveColor = "rgba(139, 92, 246, 0.2)",
  amplitude = 50,
  frequency = 0.02,
  speed = 0.02,
  numberOfWaves = 3,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef(0);

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      offsetRef.current += speed;

      for (let wave = 0; wave < numberOfWaves; wave++) {
        ctx.beginPath();
        
        const waveOffset = (wave * Math.PI * 2) / numberOfWaves;
        const waveAmplitude = amplitude * (1 - wave * 0.2);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = 
            canvas.height / 2 + 
            Math.sin(x * frequency + offsetRef.current + waveOffset) * waveAmplitude +
            Math.sin(x * frequency * 2 + offsetRef.current * 1.5 + waveOffset) * (waveAmplitude * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveColor, amplitude, frequency, speed, numberOfWaves]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
