import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function LayeredBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Generate particles
    const generatedParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      duration: Math.random() * 20 + 30,
      delay: Math.random() * 10,
    }));
    setParticles(generatedParticles);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) {
    // Static gradient for users who prefer reduced motion
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Gradient Mesh */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Aurora Ribbons */}
      <div className="absolute inset-0 opacity-30 dark:opacity-50">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 100%)",
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          style={{
            background: "linear-gradient(225deg, rgba(6, 182, 212, 0.4) 0%, rgba(168, 85, 247, 0.3) 100%)",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/3 w-[450px] h-[450px] blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 80, 0],
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
          style={{
            background: "linear-gradient(315deg, rgba(59, 130, 246, 0.35) 0%, rgba(6, 182, 212, 0.3) 100%)",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 dark:from-blue-300 dark:to-cyan-300"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, particle.x % 2 === 0 ? 20 : -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cypherpunk Theme Override */}
      <div className="cypherpunk:block hidden absolute inset-0 bg-black/40"></div>
      <div className="cypherpunk:block hidden absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 30% 40%, rgba(0, 255, 65, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 255, 65, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(0, 255, 65, 0.2) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(0, 255, 65, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 40%, rgba(0, 255, 65, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 255, 65, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
