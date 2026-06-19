"use client";

/**
 * EditorialTestimonials — 2026 Vogue premium redesign.
 *
 * Layout:
 *   1. Featured testimonial: full-width, large italic serif, B&W rectangular portrait
 *   2. Supporting trio: 3-col minimal grid, B&W portrait thumbnails
 *   3. NDA marquee: ink strip, scrolling punchy client quotes
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

// Punchy NDA quotes for the marquee — identity protected
const MARQUEE_QUOTES = [
  "I came in thinking I had a drinking problem. I left understanding I had a clarity problem.",
  "The work was not a rebuild. It was the return of a capacity I had quietly stopped believing in.",
  "She asked the question I didn't know I was avoiding — and then she waited.",
  "Something about her quality of attention made it impossible to stay vague with myself.",
  "In a remarkably short time, she helped me arrive at realisations I'd been circling for years.",
];

function Attribution({
  name,
  role,
  nda,
  size = "sm",
}: {
  name: string;
  role: string | null;
  nda: boolean;
  size?: "sm" | "lg";
}) {
  const displayName = nda ? role : name;
  const displayRole = nda ? null : role;
  return (
    <figcaption
      className={`border-t border-pink/25 ${size === "lg" ? "pt-6 mt-10" : "pt-4 mt-6"}`}
    >
      {displayName && (
        <p
          className={`uppercase tracking-[0.22em] text-ink font-medium ${
            size === "lg" ? "text-[11px]" : "text-[10px]"
          }`}
        >
          {displayName}
        </p>
      )}
      {displayRole && (
        <p
          className={`uppercase tracking-[0.16em] text-ink-quiet mt-1 ${
            size === "lg" ? "text-[10px]" : "text-[9px]"
          }`}
        >
          {displayRole}
        </p>
      )}
      {nda && (
        <p className="text-[9px] uppercase tracking-[0.18em] text-ink-quiet/60 mt-1">
          Identity withheld · NDA
        </p>
      )}
    </figcaption>
  );
}

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...MARQUEE_QUOTES, ...MARQUEE_QUOTES];

  return (
    <div
      className="bg-ink overflow-hidden py-7 border-t border-white/5"
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex gap-0 will-change-transform"
        style={{ animation: "testimonial-ticker 60s linear infinite" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.animationPlayState =
            "paused")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.animationPlayState =
            "running")
        }
      >
        {doubled.map((q, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span className="font-[family-name:var(--font-display)] italic text-cream/55 text-[14px] leading-snug px-10 whitespace-nowrap">
              &ldquo;{q}&rdquo;
            </span>
            <span className="text-pink/40 text-[8px] flex-shrink-0 pr-2">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes testimonial-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export function EditorialTestimonials({ testimonials }: Props) {
  const [featured, ...rest] = testimonials;
  const supporting = rest.slice(0, 3);

  return (
    <section className="bg-cream border-t border-sand/30">
      {/* ── Eyebrow ── */}
      <div className="container-content pt-20 md:pt-28 pb-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-16 md:mb-20 font-[family-name:var(--font-body)]">
          Women who have done this work
        </p>
      </div>

      {/* ── 1. Featured testimonial ── */}
      {featured && (
        <div className="container-content pb-16 md:pb-24">
          <div className="grid md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_380px] gap-10 xl:gap-20 items-start">
            {/* Text side */}
            <figure>
              <span
                aria-hidden
                className="block font-[family-name:var(--font-display)] italic text-pink/35 leading-none -mb-6 select-none"
                style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
              >
                &ldquo;
              </span>
              <blockquote
                className="font-[family-name:var(--font-display)] italic text-ink leading-[1.28]"
                style={{ fontSize: "clamp(22px, 3vw, 38px)" }}
              >
                {featured.quote}
              </blockquote>
              <Attribution
                name={featured.name}
                role={featured.role}
                nda={featured.nda}
                size="lg"
              />
            </figure>

            {/* Portrait — B&W rectangular, no radius */}
            {featured.photoPath && !featured.nda && (
              <div className="relative w-full aspect-[3/4] overflow-hidden hidden md:block">
                <Image
                  src={featured.photoPath}
                  alt={featured.name}
                  fill
                  sizes="(max-width: 1280px) 300px, 380px"
                  className="object-cover object-top grayscale hover:grayscale-0 transition-[filter] duration-700"
                  priority={false}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="container-content">
        <div className="border-t border-sand/50 mb-16 md:mb-24" />
      </div>

      {/* ── 2. Supporting trio ── */}
      {supporting.length > 0 && (
        <div className="container-content pb-20 md:pb-28">
          <div className="grid md:grid-cols-3 gap-x-10 xl:gap-x-16 gap-y-14">
            {supporting.map((item) => (
              <article key={item.key} className="flex flex-col">
                {/* Number label */}
                <span className="text-[9px] uppercase tracking-[0.3em] text-pink/60 mb-5 font-[family-name:var(--font-body)]">
                  Client review
                </span>

                <blockquote className="font-[family-name:var(--font-display)] italic text-[17px] leading-[1.7] text-ink flex-1">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                {/* Portrait thumbnail + attribution */}
                <div className="mt-7 pt-5 border-t border-sand/50 flex items-center gap-4">
                  {item.photoPath && !item.nda && (
                    <div className="relative w-[52px] h-[68px] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.photoPath}
                        alt={item.name}
                        fill
                        sizes="52px"
                        className="object-cover object-top grayscale"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink font-medium">
                      {item.nda ? item.role : item.name}
                    </p>
                    {!item.nda && item.role && (
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-ink-quiet">
                        {item.role}
                      </p>
                    )}
                    {item.nda && (
                      <p className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-ink-quiet/60">
                        Identity withheld · NDA
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. NDA marquee ── */}
      <Marquee />
    </section>
  );
}
