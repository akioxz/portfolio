"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import SplitText from "./react-bits/SplitText";
import RotatingText from "./react-bits/RotatingText";
import PixelTransition from "./react-bits/PixelTransition";
import { VscMail, VscGithub, VscArrowRight } from "react-icons/vsc";

/* ─── Inline Tech Badge ────────────────────────────────────────── */
function Badge({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-surface/80 border border-slate/25 rounded-sm px-2.5 py-0.5 text-[13px] font-mono font-medium text-cream whitespace-nowrap align-middle mx-0.5">
      {icon}
      {label}
    </span>
  );
}

export default function Hero() {
  const [step, setStep] = useState(0);
  const rotatingTextRef = useRef<any>(null);

  const rotatingTexts = useMemo(
    () => [
      "View Resume",
      "Still polishing this",
      "Almost there",
      "Thanks for your patience",
    ],
    [],
  );

  const handleButtonClick = () => {
    if (step >= rotatingTexts.length - 1) {
      setStep(0);
      rotatingTextRef.current?.reset();
      return;
    }

    const nextStep = step + 1;
    setStep(nextStep);
    rotatingTextRef.current?.next();
  };

  return (
    <section id="hero" className="mb-20">
      {/* ── Avatar + Name Row ─────────────────── */}
      <div className="flex items-center gap-5 mb-6">
        {/* Circular Avatar with Pixel Transition */}
        <div className="w-[130px] h-[130px] shrink-0">
          <PixelTransition
            firstContent={
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/photo1.png"
                  alt="Axel Villanueva"
                  fill
                  priority
                  sizes="130px"
                  className="object-cover"
                />
              </div>
            }
            secondContent={
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/photo2.png"
                  alt="Axel Villanueva"
                  fill
                  priority
                  sizes="130px"
                  className="object-cover"
                />
              </div>
            }
            gridSize={8}
            pixelColor="rgb(var(--teal))"
            animationStepDuration={0.35}
            aspectRatio="100%"
            className="!w-[130px] !h-[130px] !rounded-full !border-slate/20 !bg-surface"
          />
        </div>

        {/* Name + Social Icons */}
        <div>
          <h1 className="font-mono text-[2rem] font-semibold text-cream leading-none mb-2">
            Axel Villanueva
          </h1>
          {/* Social Icons Row */}
          <div className="flex items-center gap-3 text-slate">
            <a
              href="https://github.com/akioxz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal transition-colors duration-200"
              aria-label="GitHub"
            >
              <VscGithub className="w-5 h-5" />
            </a>
            <a
              href="mailto:akiocodm@gmail.com"
              className="hover:text-teal transition-colors duration-200"
              aria-label="Email"
            >
              <VscMail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Headline ──────────────────────────── */}
      <div className="flex flex-wrap items-baseline gap-2 mb-6">
        <SplitText
          text="Freelance Web Developer"
          tag="h2"
          className="font-mono text-[1.35rem] font-normal text-cream tracking-tight leading-tight inline-flex items-baseline"
          splitType="words"
          delay={40}
          duration={0.6}
          ease="power3.out"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
          threshold={0}
          rootMargin="0px"
        />
        <span className="inline-flex items-baseline font-mono text-[1.35rem] font-normal tracking-tight leading-tight">
          <span className="text-cream">—</span>
          <span className="text-slate">&nbsp;React &amp; Mobile</span>
        </span>
      </div>

      {/* ── Bio with inline tech badges ───────── */}
      <p className="text-slate text-base leading-[1.85] mb-8 max-w-2xl">
        4th-year BSIT student passionate about full-stack software engineering —
        building web and mobile applications with <Badge label="React Native" />{" "}
        and <Badge label="Supabase" />. Lately diving into AI integration and
        generative AI, exploring how these tools can be applied to real-world
        software development. Still learning, but actively building and shipping
        projects along the way.
      </p>

      {/* ── CTA Button ────────────────────────── */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="group inline-flex items-center gap-2 bg-cream text-ink px-5 py-3 rounded-md font-mono text-sm font-semibold hover:bg-cream/90 transition-colors duration-300 select-none"
      >
        <RotatingText
          ref={rotatingTextRef}
          texts={rotatingTexts}
          auto={false}
          loop={false}
          splitBy="words"
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
          staggerDuration={0.02}
          mainClassName="inline-flex items-center"
          elementLevelClassName="inline-block"
        />
        <VscArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
      </button>
    </section>
  );
}
