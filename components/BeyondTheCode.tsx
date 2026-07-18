"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import SplitText from "./react-bits/SplitText";
import Masonry from "./react-bits/Masonry";

export default function BeyondTheCode() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen]);

  const galleryItems = useMemo(
    () => [
      { id: "photo3", img: "/photo3.jpg", height: 360 },
      { id: "photo4", img: "/photo4.jpg", height: 420 },
      { id: "photo5", img: "/photo5.jpg", height: 380 },
      { id: "photo6", img: "/photo6.jpg", height: 320 },
      { id: "photo7", img: "/photo7.jpg", height: 460 },
      { id: "photo8", img: "/photo8.jpeg", height: 340 },
      { id: "photo9", img: "/photo9.jpeg", height: 400 },
      { id: "photo10", img: "/photo10.jpeg", height: 360 },
      { id: "photo11", img: "/photo11.jpeg", height: 440 },
    ],
    [],
  );

  const pickPreviewImages = () => {
    const shuffled = [...galleryItems];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }

    return shuffled.slice(0, 4).map((item) => item.img);
  };

  useEffect(() => {
    setPreviewImages(pickPreviewImages());
  }, [galleryItems]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsFading(true);
      window.setTimeout(() => {
        setPreviewImages(pickPreviewImages());
        setIsFading(false);
      }, 250);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [galleryItems]);

  return (
    <section id="beyond" className="mb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 sm:gap-12">
        <div className="max-w-sm leading-relaxed text-slate">
          <SplitText
            text="Beyond the Code"
            tag="h2"
            className="text-xl font-mono text-cream mb-4"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />
          <p className="text-cream text-sm mb-4">
            Beyond development, I spend my downtime with movies, anime, and
            online games — and I collect anime figurines on the side. It keeps
            things balanced and gives me space to think outside the code.
          </p>
          <p className="text-xs"></p>
        </div>

        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className="group w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] self-center sm:self-auto overflow-hidden rounded-xl border border-slate/10 bg-surface/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate/25 cursor-pointer"
          aria-label="View photo gallery"
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
            {previewImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className={`relative overflow-hidden bg-slate/10 transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
              >
                <Image
                  src={src}
                  alt="Hobby photo preview"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </button>
      </div>

      {isGalleryOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div
              className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-cream transition hover:bg-white/20"
                aria-label="Close gallery"
              >
                ×
              </button>
              <div className="h-[70vh] min-h-[320px] w-full">
                <Masonry items={galleryItems} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
