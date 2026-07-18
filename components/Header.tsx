"use client";

import { useState, useEffect } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for subtle background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking a link
  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { label: "projects", href: "#projects" },
    { label: "stack", href: "#stack" },
    { label: "education", href: "#education" },
    { label: "contact", href: "#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-ink/60 backdrop-blur-sm border-b border-slate/10"
          : "bg-transparent border-b border-slate/5"
      }`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="font-mono font-bold text-cream text-sm tracking-widest select-none">
            AJV
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-[0.1em] text-slate">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
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
                onClick={handleNavClick}
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
