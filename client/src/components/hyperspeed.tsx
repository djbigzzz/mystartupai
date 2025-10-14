import { useEffect, useRef } from 'react';

interface HyperspeedProps {
  className?: string;
}

export function Hyperspeed({ className = '' }: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
      x: number = 0;
      y: number = 0;
      z: number = 0;
      prevZ: number = 0;

      constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width - canvas.width / 2;
        this.y = Math.random() * canvas.height - canvas.height / 2;
        this.z = Math.random() * canvas.width;
        this.prevZ = this.z;
      }

      update(speed: number) {
        if (!canvas) return;
        this.prevZ = this.z;
        this.z -= speed;

        if (this.z <= 0) {
          this.x = Math.random() * canvas.width - canvas.width / 2;
          this.y = Math.random() * canvas.height - canvas.height / 2;
          this.z = canvas.width;
          this.prevZ = this.z;
        }
      }

      draw() {
        if (!ctx || !canvas) return;

        const sx = (this.x / this.z) * canvas.width + canvas.width / 2;
        const sy = (this.y / this.z) * canvas.height + canvas.height / 2;
        const px = (this.x / this.prevZ) * canvas.width + canvas.width / 2;
        const py = (this.y / this.prevZ) * canvas.height + canvas.height / 2;

        const lineWidth = (1 - this.z / canvas.width) * 3;
        const opacity = 1 - this.z / canvas.width;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    }

    // Initialize stars
    for (let i = 0; i < 500; i++) {
      stars.push(new Star());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.update(10);
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
