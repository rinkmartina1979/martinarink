"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  /** Full privacy-safe embed URL (Vimeo player or youtube-nocookie) */
  src: string;
  /** Accessible iframe title */
  title: string;
  /** Editorial number badge — "01", "02", etc. */
  number: string;
  /** Short caption shown below the player */
  caption?: string;
  className?: string;
}

/**
 * VideoEmbed — 2026 editorial video card.
 *
 * Features:
 *  - Pulse skeleton until iframe is ready (with 2s fallback in case onLoad misfires)
 *  - Privacy-first: Vimeo dnt=1 · YouTube youtube-nocookie.com
 *  - aspect-video (16:9) — no layout shift
 *  - Pink accent ring on hover with soft glow
 *  - Numbered badge below card for editorial hierarchy
 */
export function VideoEmbed({ src, title, number, caption, className }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fallback: show the iframe after 2 s even if onLoad hasn't fired.
    // This prevents a permanently invisible player when the browser suppresses
    // cross-origin iframe load events.
    timerRef.current = setTimeout(() => setLoaded(true), 2000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className={cn("group flex flex-col", className)}>

      {/* ── Card shell ────────────────────────────────── */}
      <div
        className="
          relative overflow-hidden rounded-[2px]
          border border-white/10
          transition-all duration-500 ease-out
          hover:border-pink/40
          hover:shadow-[0_24px_64px_rgba(249,66,170,0.14)]
        "
      >
        {/* 16 : 9 iframe container — zero layout shift */}
        <div className="relative aspect-video bg-[#1A1020]">

          {/* Loading skeleton — pulses until iframe is ready */}
          {!loaded && (
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#2A1830] to-[#1A1020]"
            />
          )}

          <iframe
            src={src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
            onLoad={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              setLoaded(true);
            }}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* Caption strip */}
        {caption && (
          <div className="px-5 py-3.5 bg-[#150E1C]/80 border-t border-white/[0.06] backdrop-blur-sm">
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-cream/40">
              {caption}
            </p>
          </div>
        )}
      </div>

      {/* ── Number badge ──────────────────────────────── */}
      <p className="mt-3.5 font-[family-name:var(--font-body)] text-[0.5625rem] uppercase tracking-[0.32em] text-cream/25 select-none">
        {number}
      </p>

    </div>
  );
}
