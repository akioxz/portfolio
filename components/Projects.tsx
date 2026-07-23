"use client";

import { motion } from "motion/react";
import SplitText from "./react-bits/SplitText";
import {
  SiReact,
  SiExpo,
  SiTypescript,
  SiSupabase,
  SiNextdotjs,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

/* ─── Project Data ─────────────────────────────────────────────── */
const projects = [
  {
    name: "Atelier Carven",
    status: null,
    description:
      "Luxury furniture e-commerce app — role-based admin/user navigation, Supabase RLS-secured data layer, and full spec-compliance review.",
    tags: ["React Native", "Expo", "TypeScript", "Supabase"],
    image: null, // Replace with "/projects/ateliercarven.png"
  },
  {
    name: "Quorin",
    status: null,
    description:
      "PC parts e-commerce platform — category-based catalog with spec comparison, role-based admin dashboard, and Supabase-backed inventory management.",
    tags: ["Next.js", "TypeScript", "Supabase", "Zustand"],
    image: null, // Replace with "/projects/quorin.png"
  },
];

/* ─── Tag Icon Helper ──────────────────────────────────────────── */
function getTagIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case "react native":
    case "react":
      return (
        <SiReact
          key={tag}
          className="w-4 h-4 text-teal hover:text-teal/80 transition-colors"
          title="React Native"
        />
      );
    case "expo":
      return (
        <SiExpo
          key={tag}
          className="w-4 h-4 text-cream hover:text-cream/80 transition-colors"
          title="Expo"
        />
      );
    case "next.js":
    case "nextjs":
      return (
        <SiNextdotjs
          key={tag}
          className="w-4 h-4 text-cream hover:text-cream/80 transition-colors"
          title="Next.js"
        />
      );
    case "typescript":
      return (
        <SiTypescript
          key={tag}
          className="w-4 h-4 text-[#3178c6] hover:text-[#3178c6]/80 transition-colors"
          title="TypeScript"
        />
      );
    case "supabase":
      return (
        <SiSupabase
          key={tag}
          className="w-4 h-4 text-[#3ecf8e] hover:text-[#3ecf8e]/80 transition-colors"
          title="Supabase"
        />
      );
    case "zustand":
      return (
        <VscCode
          key={tag}
          className="w-4 h-4 text-amber hover:text-amber/80 transition-colors"
          title="Zustand"
        />
      );
    default:
      return null;
  }
}

/* ─── "In Progress" Preview ────────────────────────────────────────
   Shown in the screenshot slot for projects without a real preview
   image yet — a subtle animated dot-grid with a slow-sweeping
   spotlight and a pulsing "in development" status, instead of a
   plain static name sitting in an empty box. ─────────────────────── */
function BuildingPreview({ name }: { name: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-surface">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(var(--text-secondary)) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Sweeping spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(220px circle at var(--x) var(--y), rgba(var(--spotlight), 0.16), transparent 70%)",
        }}
        animate={{
          "--x": ["10%", "90%", "10%"],
          "--y": ["20%", "80%", "20%"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Centered label */}
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
        <span className="font-mono text-sm text-slate/70 select-none tracking-wide">
          {name}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber/70 animate-pulse" />
          upgrading
        </span>
      </div>
    </div>
  );
}

function ProjectCard({
  name,
  status,
  description,
  tags,
  image,
}: {
  name: string;
  status: string | null;
  description: string;
  tags: string[];
  image: string | null;
}) {
  return (
    <div className="group block rounded-xl border border-slate/10 bg-surface/50 overflow-hidden transition-all duration-300 hover:border-slate/25 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
      {/* Screenshot Preview */}
      <div className="relative aspect-[16/10] bg-surface overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${name} preview`}
            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <BuildingPreview name={name} />
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Title + Status Badge */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-mono text-base font-semibold text-cream">
            {name}
          </h3>
          {status && (
            <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-amber border border-amber/30 rounded px-1.5 py-0.5 whitespace-nowrap">
              {status}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tech Icons (not text) */}
        <div className="flex flex-wrap items-center gap-3">
          {tags.map((tag) => getTagIcon(tag))}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects Section ─────────────────────────────────────────── */
export default function Projects() {
  return (
    <section id="projects" className="mb-20 scroll-mt-24">
      <SplitText
        text="Projects"
        tag="h2"
        className="text-[2rem] font-mono text-cream mb-8"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}