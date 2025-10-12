import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/theme-context";
import { useLocation } from "wouter";

interface MatrixChar {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
}

interface ClickEffect {
  x: number;
  y: number;
  timestamp: number;
}

export function CypherpunkEffects() {
  const { theme } = useTheme();
  const [location] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCharsRef = useRef<MatrixChar[]>([]);
  const clickEffectsRef = useRef<ClickEffect[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // Only run effects in cypherpunk theme AND not on landing or auth pages
    if (theme !== "cypherpunk" || location === "/" || location === "/app") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("CypherpunkEffects: Initializing Matrix rain...");

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`CypherpunkEffects: Canvas resized to ${canvas.width}x${canvas.height}`);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters
    const characters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜヲﾝ01234567891234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize Matrix rain drops
    const initMatrixChars = () => {
      matrixCharsRef.current = [];
      for (let i = 0; i < columns; i++) {
        matrixCharsRef.current.push({
          x: i * fontSize,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1,
          char: characters[Math.floor(Math.random() * characters.length)],
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
      console.log(`CypherpunkEffects: Initialized ${matrixCharsRef.current.length} Matrix columns`);
    };
    initMatrixChars();

    // Click handler for terminal-style ripples
    const handleClick = (e: MouseEvent) => {
      clickEffectsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      console.log(`CypherpunkEffects: Click at (${e.clientX}, ${e.clientY})`);
    };

    window.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const matrixChars = matrixCharsRef.current;
      const clickEffects = clickEffectsRef.current;
      const now = Date.now();

      // Set font for Matrix characters
      ctx.font = `${fontSize}px "Courier New", monospace`;

      // Draw Matrix rain
      matrixChars.forEach(drop => {
        // Randomly change character
        if (Math.random() > 0.98) {
          drop.char = characters[Math.floor(Math.random() * characters.length)];
        }

        // Brighter head of the drop - BLUE
        ctx.fillStyle = `rgba(100, 180, 255, ${drop.opacity})`;
        ctx.fillText(drop.char, drop.x, drop.y);

        // Dimmer trail - BLUE
        ctx.fillStyle = `rgba(80, 150, 230, ${drop.opacity * 0.5})`;
        ctx.fillText(
          characters[Math.floor(Math.random() * characters.length)],
          drop.x,
          drop.y - fontSize
        );

        // Very dim trail - BLUE
        ctx.fillStyle = `rgba(60, 120, 200, ${drop.opacity * 0.2})`;
        ctx.fillText(
          characters[Math.floor(Math.random() * characters.length)],
          drop.x,
          drop.y - fontSize * 2
        );

        // Update position
        drop.y += drop.speed;

        // Reset to top when reaching bottom
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.speed = Math.random() * 2 + 1;
          drop.opacity = Math.random() * 0.5 + 0.5;
        }
      });

      // Draw click effects - terminal-style expanding brackets
      clickEffects.forEach(effect => {
        const age = now - effect.timestamp;
        const progress = age / 600;
        
        if (progress < 1) {
          const size = 30 + (50 * progress);
          const opacity = 1 - progress;

          ctx.font = `${Math.floor(size)}px "Courier New", monospace`;
          ctx.fillStyle = `rgba(100, 180, 255, ${opacity})`;
          
          // Draw expanding brackets
          const bracket = progress < 0.5 ? '[' : '{';
          const closeBracket = progress < 0.5 ? ']' : '}';
          
          ctx.fillText(bracket, effect.x - size, effect.y);
          ctx.fillText(closeBracket, effect.x + size, effect.y);

          // Draw vertical bars
          ctx.fillText('|', effect.x, effect.y - size);
          ctx.fillText('|', effect.x, effect.y + size);

          // Draw center cross
          if (progress < 0.3) {
            ctx.fillStyle = `rgba(100, 180, 255, ${opacity * 1.5})`;
            ctx.fillText('+', effect.x - 7, effect.y + 5);
          }
        }
      });

      // Clean up old click effects
      clickEffectsRef.current = clickEffects.filter(e => now - e.timestamp < 600);
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
    console.log("CypherpunkEffects: Animation loop started");

    return () => {
      console.log("CypherpunkEffects: Cleaning up");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme, location]);

  // Only render canvas in cypherpunk theme and not on landing or auth pages
  if (theme !== "cypherpunk" || location === "/" || location === "/app") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'normal', opacity: 0.6 }}
    />
  );
}
