import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/theme-context";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface MouseTrail {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  type: 'sol' | 'btc' | 'eth';
}

export function Web3Effects() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouseTrail, setMouseTrail] = useState<MouseTrail[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // Only run effects in web3 theme
    if (theme !== "web3") {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };
    initParticles();

    // Initialize floating coins
    const initCoins = () => {
      const coins: FloatingCoin[] = [];
      const types: ('sol' | 'btc' | 'eth')[] = ['sol', 'btc', 'eth'];
      for (let i = 0; i < 8; i++) {
        coins.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rotation: Math.random() * 360,
          speed: Math.random() * 0.3 + 0.1,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }
      setFloatingCoins(coins);
    };
    initCoins();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Add to mouse trail
      setMouseTrail(prev => {
        const newTrail = [
          ...prev,
          { id: Date.now(), x: e.clientX, y: e.clientY, timestamp: Date.now() }
        ].slice(-15); // Keep last 15 trail points
        return newTrail;
      });
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      setClickEffects(prev => [
        ...prev,
        { id: Date.now(), x: e.clientX, y: e.clientY, timestamp: Date.now() }
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction - particles attracted to mouse
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx += (dx / dist) * force * 0.02;
          particle.vy += (dy / dist) * force * 0.02;
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(138, 43, 226, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw mouse trail
      mouseTrail.forEach((point, index) => {
        const age = Date.now() - point.timestamp;
        const opacity = Math.max(0, 1 - age / 1000);
        const size = Math.max(0.1, 20 * (1 - age / 1000)); // Prevent negative radius

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size
        );
        gradient.addColorStop(0, `rgba(255, 0, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(138, 43, 226, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Clean up old trail points
      setMouseTrail(prev => prev.filter(p => Date.now() - p.timestamp < 1000));

      // Draw click effects
      clickEffects.forEach(effect => {
        const age = Date.now() - effect.timestamp;
        const progress = age / 800;
        
        if (progress < 1) {
          const radius = 50 * progress;
          const opacity = 1 - progress;

          // Outer ring
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Inner ring
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 0, 255, ${opacity * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Particles explosion
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const particleRadius = radius * 0.8;
            const px = effect.x + Math.cos(angle) * particleRadius;
            const py = effect.y + Math.sin(angle) * particleRadius;
            
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.1, 3 * (1 - progress)), 0, Math.PI * 2); // Prevent negative radius
            ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
            ctx.fill();
          }
        }
      });

      // Clean up old click effects
      setClickEffects(prev => prev.filter(e => Date.now() - e.timestamp < 800));

      // Draw floating coins
      floatingCoins.forEach(coin => {
        coin.y -= coin.speed;
        coin.rotation += 2;

        // Reset when off screen
        if (coin.y < -50) {
          coin.y = canvas.height + 50;
          coin.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(coin.x, coin.y);
        ctx.rotate((coin.rotation * Math.PI) / 180);

        // Draw coin based on type
        const coinSize = 30;
        ctx.beginPath();
        ctx.arc(0, 0, coinSize, 0, Math.PI * 2);
        
        let gradient;
        if (coin.type === 'sol') {
          gradient = ctx.createLinearGradient(-coinSize, -coinSize, coinSize, coinSize);
          gradient.addColorStop(0, 'rgba(220, 31, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(1, 242, 227, 0.6)');
        } else if (coin.type === 'btc') {
          gradient = ctx.createLinearGradient(-coinSize, -coinSize, coinSize, coinSize);
          gradient.addColorStop(0, 'rgba(247, 147, 26, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0.6)');
        } else {
          gradient = ctx.createLinearGradient(-coinSize, -coinSize, coinSize, coinSize);
          gradient.addColorStop(0, 'rgba(98, 126, 234, 0.6)');
          gradient.addColorStop(1, 'rgba(99, 179, 237, 0.6)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw coin symbol
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coin.type.toUpperCase(), 0, 0);

        ctx.restore();
      });

      setParticles([...particles]);
      setFloatingCoins([...floatingCoins]);
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme, particles, mouseTrail, clickEffects, floatingCoins]);

  // Only render canvas in web3 theme
  if (theme !== "web3") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
