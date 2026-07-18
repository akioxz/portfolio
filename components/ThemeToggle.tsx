"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    const button = buttonRef.current;
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    document.documentElement.classList.add("theme-transitioning");

    if (
      typeof documentWithTransition.startViewTransition === "function" &&
      button
    ) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.style.setProperty("--theme-reveal-x", `${x}px`);
      document.documentElement.style.setProperty("--theme-reveal-y", `${y}px`);
      document.documentElement.style.setProperty(
        "--theme-reveal-radius",
        `${radius}px`,
      );

      documentWithTransition.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 500);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-8 h-8 text-slate hover:text-teal transition-colors"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
}
