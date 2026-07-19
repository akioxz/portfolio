"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogoSplashProps {
  onComplete: () => void;
  holdDuration?: number; // ms the logo stays fully visible before fading out
}

/* ─── Logo splash ──────────────────────────────────────────────────
   Brief full-screen overlay showing the "AJV" wordmark on load, then
   fades out to reveal the page underneath. Matches Header.tsx's logo
   styling (font-mono, bold, tracking-widest) so it reads as the same
   mark, not a separate design. ───────────────────────────────────── */
export default function LogoSplash({
  onComplete,
  holdDuration = 550,
}: LogoSplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, holdDuration);
    return () => clearTimeout(holdTimer);
  }, [holdDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-bold text-cream text-2xl tracking-[0.3em] select-none"
          >
            AJV
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
