"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Player from "@vimeo/player";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  /** Vimeo share URL or player embed URL — video ID is extracted automatically */
  src: string;
  /** Accessible label for the video */
  title: string;
  /** Editorial number badge — "01", "02", etc. */
  number: string;
  /** Short caption shown below the player */
  caption?: string;
  className?: string;
}

/** Extract numeric Vimeo video ID from any Vimeo URL format */
function extractVimeoId(url: string): number | null {
  const match = url.match(/(?:video\/|vimeo\.com\/)(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/** True for youtube.com / youtube-nocookie.com / youtu.be URLs. */
function isYouTubeUrl(url: string): boolean {
  return /youtube(-nocookie)?\.com|youtu\.be/.test(url);
}

/**
 * VideoEmbed — 2026 Vimeo SDK integration.
 *
 * Uses the official @vimeo/player SDK (not a raw iframe) so we get:
 *   - Real play / pause / stop controls with SDK events
 *   - Proper error reporting instead of the browser broken-plugin icon
 *   - Responsive sizing via SDK `responsive: true`
 *   - Pink editorial overlay UI matching brand
 */
export function VideoEmbed({ src, title, number, caption, className }: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const youtube = isYouTubeUrl(src);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // YouTube — plain privacy-safe iframe. No Vimeo SDK involved, so its
  // custom play/pause/stop controls below don't apply; the iframe's own
  // native YouTube controls are used instead.
  useEffect(() => {
    if (!youtube) return;
    setReady(false);
    setError(null);
  }, [src, youtube]);

  // Vimeo — official SDK for real controls + proper error reporting.
  useEffect(() => {
    if (youtube) return;
    if (!containerRef.current) return;

    const videoId = extractVimeoId(src);
    if (!videoId) {
      setError("Invalid Vimeo URL");
      return;
    }

    const player = new Player(containerRef.current, {
      id: videoId,
      responsive: true,
      autoplay: false,
      muted: false,
      controls: true,       // native Vimeo controls + our overlay
      color: "F942AA",      // pink brand accent on Vimeo scrubber
      title: false,
      byline: false,
      portrait: false,
      dnt: false,
    });

    player.ready()
      .then(() => setReady(true))
      .catch((e: Error) => setError(e.message ?? "Video could not load"));

    player.on("play",  () => setPlaying(true));
    player.on("pause", () => setPlaying(false));
    player.on("ended", () => setPlaying(false));
    player.on("error", (e: { message?: string }) =>
      setError(e.message ?? "Playback error"),
    );

    playerRef.current = player;
    return () => { player.destroy(); };
  }, [src, youtube]);

  const handlePlay = useCallback(async () => {
    if (!playerRef.current) return;
    try { await playerRef.current.play(); } catch { /* user gesture restriction */ }
  }, []);

  const handlePause = useCallback(async () => {
    if (!playerRef.current) return;
    await playerRef.current.pause();
  }, []);

  const handleStop = useCallback(async () => {
    if (!playerRef.current) return;
    await playerRef.current.pause();
    await playerRef.current.setCurrentTime(0);
    setPlaying(false);
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
        {/* ── Error state ── */}
        {error && (
          <div className="aspect-video bg-[#1A1020] flex flex-col items-center justify-center gap-4 px-8 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-pink/60" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-[0.18em] text-cream/40">
              Video unavailable
            </p>
            <p className="font-[family-name:var(--font-body)] text-[11px] text-cream/25 max-w-xs leading-relaxed">
              {error.includes("privacy") || error.includes("private")
                ? 'This video is set to private on Vimeo. Update the privacy settings to “Public” or “Unlisted” with embedding enabled.'
                : error}
            </p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {!ready && !error && (
          <div
            aria-hidden
            className="aspect-video animate-pulse bg-gradient-to-br from-[#2A1830] to-[#1A1020] flex items-center justify-center"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden className="opacity-20">
              <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="1.5"/>
              <path d="M20 16l14 8-14 8V16z" fill="white"/>
            </svg>
          </div>
        )}

        {/* ── YouTube — plain iframe ── */}
        {youtube && !error && (
          <div
            className={cn(
              "relative aspect-video transition-opacity duration-500",
              ready ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none",
            )}
          >
            <iframe
              src={src}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onLoad={() => setReady(true)}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* ── Vimeo SDK player mount point ── */}
        {!youtube && (
          <div
            ref={containerRef}
            className={cn(
              "transition-opacity duration-500",
              ready && !error ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none",
            )}
            aria-label={title}
          />
        )}

        {/* Caption strip */}
        {caption && (
          <div className="px-5 py-3.5 bg-[#150E1C]/80 border-t border-white/[0.06] backdrop-blur-sm">
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-cream/40">
              {caption}
            </p>
          </div>
        )}
      </div>

      {/* ── Custom editorial controls (play / pause / stop) — Vimeo SDK only;
            YouTube's iframe ships its own native controls. ── */}
      {ready && !error && !youtube && (
        <div className="mt-4 flex items-center gap-3">
          {/* Play / Pause toggle */}
          <button
            onClick={playing ? handlePause : handlePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="
              flex items-center gap-2 px-4 py-2
              text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-body)]
              text-cream/60 hover:text-cream
              border border-white/10 hover:border-pink/40
              transition-all duration-200
              rounded-[1px]
            "
          >
            {playing ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <rect x="2" y="1" width="3" height="10" rx="0.5"/>
                  <rect x="7" y="1" width="3" height="10" rx="0.5"/>
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 1.5l9 4.5-9 4.5V1.5z"/>
                </svg>
                Play
              </>
            )}
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            aria-label="Stop and reset"
            className="
              flex items-center gap-2 px-4 py-2
              text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-body)]
              text-cream/40 hover:text-cream/70
              border border-white/[0.06] hover:border-white/20
              transition-all duration-200
              rounded-[1px]
            "
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              <rect x="1" y="1" width="8" height="8" rx="0.5"/>
            </svg>
            Stop
          </button>

          {/* Number badge — moved inline with controls */}
          <span className="ml-auto font-[family-name:var(--font-body)] text-[0.5625rem] uppercase tracking-[0.32em] text-cream/20 select-none">
            {number}
          </span>
        </div>
      )}

      {/* Number badge when controls not shown */}
      {(!ready || error || youtube) && (
        <p className="mt-3.5 font-[family-name:var(--font-body)] text-[0.5625rem] uppercase tracking-[0.32em] text-cream/25 select-none">
          {number}
        </p>
      )}

    </div>
  );
}
