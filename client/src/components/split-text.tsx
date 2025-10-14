import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  type?: 'tween' | 'spring';
}

export function SplitText({ 
  text, 
  className = '', 
  delay = 0,
  animateBy = 'words',
  type = 'tween'
}: SplitTextProps) {
  const words = text.split(' ');
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: animateBy === 'words' ? 0.12 : 0.03, 
        delayChildren: delay 
      },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: type === 'spring' 
        ? {
            type: 'spring',
            damping: 12,
            stiffness: 100,
          }
        : {
            type: 'tween',
            duration: 0.5,
          },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  if (animateBy === 'letters') {
    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
            {word.split('').map((letter, letterIndex) => (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                variants={child}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
