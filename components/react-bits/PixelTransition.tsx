"use client";

import React, { useRef, useEffect, useState, CSSProperties } from "react";
import { gsap } from "gsap";

interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";
    const size = 100 / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("absolute", "pointer-events-none");
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixel.style.backgroundColor = pixelColor;
        pixel.style.opacity = "0";
        pixel.style.transform = "scale(0)";
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const handleMouseEnter = () => {
    if (isActive) return;
    setIsActive(true);

    const pixels = pixelGridRef.current?.children;
    if (!pixels) return;

    // Build random indices for pixel reveal
    const pixelArray = Array.from(pixels);
    const shuffledPixels = pixelArray.sort(() => Math.random() - 0.5);

    const tl = gsap.timeline({
      onComplete: () => {
        if (activeRef.current) {
          activeRef.current.style.opacity = "1";
        }
        gsap.to(shuffledPixels, {
          opacity: 0,
          scale: 0,
          duration: animationStepDuration,
          stagger: 0.005,
        });
      },
    });

    tl.to(shuffledPixels, {
      opacity: 1,
      scale: 1,
      duration: animationStepDuration,
      stagger: 0.005,
    });
  };

  const handleMouseLeave = () => {
    if (once) return;
    setIsActive(false);

    const pixels = pixelGridRef.current?.children;
    if (!pixels) return;

    const pixelArray = Array.from(pixels);
    const shuffledPixels = pixelArray.sort(() => Math.random() - 0.5);

    const tl = gsap.timeline({
      onComplete: () => {
        if (activeRef.current) {
          activeRef.current.style.opacity = "0";
        }
        gsap.to(shuffledPixels, {
          opacity: 0,
          scale: 0,
          duration: animationStepDuration,
          stagger: 0.005,
        });
      },
    });

    tl.to(shuffledPixels, {
      opacity: 1,
      scale: 1,
      duration: animationStepDuration,
      stagger: 0.005,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={{ ...style, width: "100%", paddingBottom: aspectRatio }}
    >
      {/* First Content */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-100">
        {firstContent}
      </div>

      {/* Second Content (Overlayed, invisible initially) */}
      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 transition-opacity pointer-events-none"
      >
        {secondContent}
      </div>

      {/* Pixel Grid Overlays */}
      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
};

export default PixelTransition;
