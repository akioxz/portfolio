"use client";

import SplitText from "./react-bits/SplitText";

export default function About() {
  return (
    <section id="about" className="mb-20">
      <SplitText
        text="About"
        tag="h2"
        className="text-xl font-mono text-cream mb-6"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />
      <p className="text-cream leading-relaxed max-w-md">
        4th-year BSIT student passionate about full-stack software engineering —
        building web and mobile applications. Lately diving into AI integration
        and generative AI, exploring how these tools can be applied to
        real-world software development. Still learning, but actively building
        and shipping projects along the way.
      </p>
    </section>
  );
}
