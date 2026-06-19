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
    <section className="bg-blush py-20 md:py-28 overflow-hidden">
      {/* ── Header row ── */}
      <div className="container-content flex items-baseline justify-between mb-10 md:mb-14">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-quiet font-[family-name:var(--font-body)]">
          Women who have done this work
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet/60 font-[family-name:var(--font-body)]">
          {pad(idx)} / {pad(total - 1)}
        </p>
      </div>

      {/* ── Slide ── */}
      <div className="container-content">
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
            <div className="grid md:grid-cols-[300px_1fr] xl:grid-cols-[380px_1fr] bg-cream">
              {/* Portrait — B&W, fills left column */}
              <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[420px] overflow-hidden">
                {item.photoPath && !item.nda ? (
                  <Image
                    src={item.photoPath}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top grayscale"
                    priority={idx === 0}
                  />
                ) : (
                  /* NDA placeholder — violet-soft with large italic mark */
                  <div className="w-full h-full bg-violet-soft flex items-end justify-start p-8 min-h-[280px]">
                    <span
                      className="font-[family-name:var(--font-display)] italic text-plum/20 leading-none select-none"
                      style={{ fontSize: "clamp(80px, 14vw, 140px)" }}
                    >
                      &ldquo;
                    </span>
                  </div>
                )}
              </div>

              {/* Quote panel */}
              <div className="p-8 md:p-12 xl:p-16 flex flex-col justify-center">
                {/* Decorative opening mark */}
                <span
                  aria-hidden
                  className="block font-[family-name:var(--font-display)] italic text-pink/30 leading-none select-none -mb-4"
                  style={{ fontSize: "clamp(64px, 8vw, 108px)" }}
                >
                  &ldquo;
                </span>

                <blockquote
                  className="font-[family-name:var(--font-display)] italic text-ink leading-[1.45]"
                  style={{ fontSize: "clamp(17px, 1.9vw, 26px)" }}
                >
                  {item.quote}
                </blockquote>

                <div className="mt-8 pt-6 border-t border-pink/25">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-ink font-medium">
                    {item.nda ? item.role : item.name}
                  </p>
                  {!item.nda && item.role && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                      {item.role}
                    </p>
                  )}
                  {item.nda && (
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink-quiet/55">
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
      <div className="container-content flex items-center justify-between mt-6 md:mt-8">
        {/* Progress bars */}
        <div className="flex gap-1.5 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Review ${i + 1}`}
              className={`h-[2px] rounded-none transition-all duration-400 ${
                i === idx ? "w-8 bg-ink" : "w-3 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => go(idx - 1)}
            aria-label="Previous review"
            className="w-10 h-10 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors duration-200"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Next review"
            className="w-10 h-10 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors duration-200"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
