"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SelfHostedVideoProps {
  /** Vercel Blob (or any direct) video URL */
  src: string;
  /** Accessible label for the video */
  title: string;
  /** Editorial number badge — "01", "02", etc. */
  number: string;
  /** Short caption shown below the player */
  caption?: string;
  /** Poster frame — prevents layout shift, shown before playback starts */
  poster?: string;
  className?: string;
}

/**
 * SelfHostedVideo — native HTML5 player for site-hosted video (Vercel Blob).
 *
 * No third-party embed, no privacy/domain-restriction settings to break,
 * no oEmbed API to fail. The browser has played MP4/H.264 natively for
 * over a decade — this is the 2026-standard replacement for embed-platform
 * dependencies like Vimeo/YouTube for content we own outright.
 */
export function SelfHostedVideo({
  src,
  title,
  number,
  caption,
  poster,
  className,
}: SelfHostedVideoProps) {
  const [error, setError] = useState(false);

  return (
    <div className={cn("group flex flex-col", className)}>
      <div
        className="
          relative overflow-hidden rounded-[2px]
          border border-white/10
          transition-all duration-500 ease-out
          hover:border-pink/40
          hover:shadow-[0_24px_64px_rgba(249,66,170,0.14)]
        "
      >
        {error ? (
          <div className="aspect-video bg-[#1A1020] flex flex-col items-center justify-center gap-4 px-8 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-pink/60" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-[0.18em] text-cream/40">
              Video unavailable
            </p>
          </div>
        ) : (
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            aria-label={title}
            onError={() => setError(true)}
            className="w-full aspect-video bg-[#1A1020]"
          />
        )}

        {caption && (
          <div className="px-5 py-3.5 bg-[#150E1C]/80 border-t border-white/[0.06] backdrop-blur-sm">
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-cream/40">
              {caption}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3.5 font-[family-name:var(--font-body)] text-[0.5625rem] uppercase tracking-[0.32em] text-cream/25 select-none">
        {number}
      </p>
    </div>
  );
}
