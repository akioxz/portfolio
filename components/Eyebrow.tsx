import React from "react";

export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate mb-2">
      {children}
    </p>
  );
}
