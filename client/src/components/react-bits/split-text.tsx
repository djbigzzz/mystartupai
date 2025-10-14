import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  onLetterAnimationComplete?: () => void;
}

export function SplitText({
  text,
  tag: Tag = "p",
  className = "",
  delay = 70,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const splitText = (text: string, type: string) => {
      if (type === "chars" || type === "words, chars") {
        return text.split("").map((char, i) => (
          char === " " ? " " : `<span class="split-char" data-index="${i}">${char}</span>`
        )).join("");
      } else if (type === "words") {
        return text.split(" ").map((word, i) => (
          `<span class="split-word" data-index="${i}">${word}</span>`
        )).join(" ");
      } else if (type === "lines") {
        return text.split("\n").map((line, i) => (
          `<span class="split-line" data-index="${i}">${line}</span>`
        )).join("<br>");
      }
      return text;
    };

    textRef.current.innerHTML = splitText(text, splitType);

    const elements = textRef.current.querySelectorAll(
      splitType === "chars" || splitType === "words, chars" 
        ? ".split-char" 
        : splitType === "words" 
        ? ".split-word" 
        : ".split-line"
    );

    gsap.set(elements, from);

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      once: true,
      onEnter: () => {
        gsap.to(elements, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: () => {
            if (onLetterAnimationComplete) {
              onLetterAnimationComplete();
            }
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin]);

  return (
    <Tag
      ref={containerRef as any}
      className={cn("split-text-container", className)}
      style={{ textAlign }}
    >
      <span ref={textRef as any} className="inline-block">
        {text}
      </span>
    </Tag>
  );
}
