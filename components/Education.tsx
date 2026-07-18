"use client";

import SplitText from "./react-bits/SplitText";
import { educationData } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="mb-20 scroll-mt-24">
      <SplitText
        text="Education"
        tag="h2"
        className="text-xl font-mono text-cream mb-8"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />

      <div className="flex flex-col gap-6">
        {educationData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-start"
          >
            <div className="font-mono text-xs text-slate">{item.years}</div>
            <div>
              <h3 className="font-mono text-sm text-cream font-medium leading-snug">
                {item.degree}
              </h3>
              <p className="text-slate text-xs mt-1">
                {item.school}
                {item.campus && ` · ${item.campus} Campus`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
