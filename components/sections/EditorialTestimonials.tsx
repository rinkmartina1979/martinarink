"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TestimonialItem {
  key: string;
  name: string;
  role: string | null;
  quote: string;
  nda: boolean;
  photoPath?: string;
}

interface Props {
  testimonials: TestimonialItem[];
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VARIANTS = {
  enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function EditorialTestimonials({ testimonials }: Props) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const total = testimonials.length;

  const go = useCallback(
    (next: number) => {
      setDir(next > idx ? 1 : -1);
      setIdx((next + total) % total);
    },
    [idx, total]
  );

  const item = testimonials[idx];

  return (
    <section className="bg-blush py-12 md:py-16 overflow-hidden">
      {/* ── Header row ── */}
      <div className="container-content max-w-3xl mx-auto flex items-baseline justify-between mb-4 md:mb-5">
        <p className="text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
          Women who have done this work
        </p>
        <p className="text-[9px] uppercase tracking-[0.18em] text-ink-quiet/60 font-[family-name:var(--font-body)]">
          {pad(idx)} / {pad(total - 1)}
        </p>
      </div>

      {/* ── Slide — contained, not full-bleed ── */}
      <div className="container-content max-w-3xl mx-auto">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0, 0.2, 1] }}
          >
            <div className="grid sm:grid-cols-[190px_1fr] bg-cream shadow-[0_1px_24px_rgba(30,27,23,0.05)]">
              {/* Portrait — B&W, fills left column */}
              <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-[240px] overflow-hidden">
                {item.photoPath && !item.nda ? (
                  <Image
                    src={item.photoPath}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 190px"
                    className="object-cover object-center grayscale"
                    priority={idx === 0}
                  />
                ) : (
                  /* NDA placeholder — violet-soft with large italic mark */
                  <div className="w-full h-full bg-blush flex items-end justify-start p-5 min-h-[160px]">
                    <span
                      className="font-[family-name:var(--font-display)] italic text-plum/20 leading-none select-none"
                      style={{ fontSize: "clamp(44px, 8vw, 72px)" }}
                    >
                      &ldquo;
                    </span>
                  </div>
                )}
              </div>

              {/* Quote panel */}
              <div className="p-6 md:p-7 flex flex-col justify-center">
                {/* Decorative opening mark */}
                <span
                  aria-hidden
                  className="block font-[family-name:var(--font-display)] italic text-pink/30 leading-none select-none -mb-2"
                  style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
                >
                  &ldquo;
                </span>

                <blockquote
                  className="font-[family-name:var(--font-display)] italic text-ink leading-[1.4]"
                  style={{ fontSize: "clamp(14px, 1.3vw, 17px)" }}
                >
                  {item.quote}
                </blockquote>

                <div className="mt-4 pt-3 border-t border-pink/25">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink font-medium">
                    {item.nda ? item.role : item.name}
                  </p>
                  {!item.nda && item.role && (
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-ink-quiet">
                      {item.role}
                    </p>
                  )}
                  {item.nda && (
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-ink-quiet/55">
                      Identity withheld · NDA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="container-content max-w-3xl mx-auto flex items-center justify-between mt-4 md:mt-5">
        {/* Progress bars */}
        <div className="flex gap-1.5 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Review ${i + 1}`}
              className={`h-[2px] rounded-none transition-all duration-400 ${
                i === idx ? "w-6 bg-ink" : "w-2.5 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => go(idx - 1)}
            aria-label="Previous review"
            className="w-8 h-8 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors duration-200"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Next review"
            className="w-8 h-8 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors duration-200"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
