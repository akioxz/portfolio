"use client";

import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking a link
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);

    // Prevent content sliding under a stationary cursor from firing
    // spurious hover events (e.g. PixelTransition's mouseenter) during
    // the programmatic scroll.
    document.body.style.pointerEvents = "none";

    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    window.setTimeout(() => {
      document.body.style.pointerEvents = "";

      // Work around a Chrome GPU-compositing bug where a stale blurred frame
      // is left painted over content after a smooth-scroll animation ends.
      document.body.style.transform = "translateZ(0)";
      requestAnimationFrame(() => {
        document.body.style.transform = "";
      });
    }, 650);
  };

  const navLinks = [
    { label: "projects", href: "#projects" },
    { label: "stack", href: "#stack" },
    { label: "education", href: "#education" },
    { label: "contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-ink/60 backdrop-blur-sm border-b border-slate/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-mono font-bold text-cream text-sm tracking-widest select-none hover:text-teal transition-colors duration-200"
          >
            AJV
          </a>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-[0.1em] text-slate">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="hover:text-teal transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side: Theme toggle + Mobile menu button */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate/20">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-slate hover:text-teal transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <IoClose className="w-5 h-5" />
              ) : (
                <IoMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate/10 pt-4 flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.1em] text-slate">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-teal transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
