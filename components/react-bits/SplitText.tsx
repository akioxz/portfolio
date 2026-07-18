"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // Initial delay in milliseconds
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 24 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  tag = "p",
  textAlign = "left",
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  // Split text into words and characters
  const words = text.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animated) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // Don't animate, just set to end state
      const targets = el.querySelectorAll(".animated-item");
      gsap.set(targets, to);
      setAnimated(true);
      if (onLetterAnimationComplete) onLetterAnimationComplete();
      return;
    }

    const startAnimation = () => {
      const targets = el.querySelectorAll(".animated-item");
      if (targets.length === 0) return;

      gsap.fromTo(targets, from, {
        ...to,
        duration,
        ease,
        delay: delay / 1000,
        stagger: 0.02,
        onComplete: () => {
          setAnimated(true);
          if (onLetterAnimationComplete) {
            onLetterAnimationComplete();
          }
        },
      });
    };

    // If threshold/rootMargin suggests immediate start (like hero name above the fold)
    // we can check if threshold is very low or if we want to run immediately.
    // However, to be fully robust and match normal expectations, we can use an IntersectionObserver.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [
    animated,
    delay,
    duration,
    ease,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  const Tag = tag;
  const hasInlineFlex = className.includes("inline-flex");
  const hasInline = className.includes("inline");
  const displayValue = hasInlineFlex
    ? "inline-flex"
    : hasInline
      ? "inline"
      : "inline-block";

  return (
    <Tag
      ref={containerRef as any}
      className={`${displayValue === "inline-flex" ? "inline-flex" : displayValue === "inline" ? "inline" : "inline-block"} select-none ${className}`}
      style={{ textAlign, display: displayValue }}
    >
      {words.map((word, wordIndex) => {
        if (splitType === "words") {
          return (
            <span
              key={wordIndex}
              className="animated-item inline-block whitespace-nowrap"
              style={{ display: "inline-block", opacity: 0 }}
            >
              {word}
              {wordIndex < words.length - 1 && "\u00A0"}
            </span>
          );
        }

        // Chars split
        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{ display: "inline-block" }}
          >
            {word.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                className="animated-item inline-block"
                style={{ display: "inline-block", opacity: 0 }}
              >
                {char}
              </span>
            ))}
            {wordIndex < words.length - 1 && (
              <span
                className="inline-block"
                style={{ display: "inline-block" }}
              >
                {"\u00A0"}
              </span>
            )}
          </span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
