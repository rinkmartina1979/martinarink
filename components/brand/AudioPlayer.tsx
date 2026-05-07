"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  duration: number;
  transcript?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function durationLabel(seconds: number): string {
  const m = Math.ceil(seconds / 60);
  return `${m} min listen`;
}

export function AudioPlayer({ src, title, duration, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    function onTimeUpdate() {
      setCurrentTime(el!.currentTime);
    }
    function onDurationChange() {
      if (!isNaN(el!.duration)) setAudioDuration(el!.duration);
    }
    function onEnded() {
      setPlaying(false);
      setCurrentTime(0);
    }

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("loadedmetadata", onDurationChange);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("loadedmetadata", onDurationChange);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      await el.play();
      setPlaying(true);
    }
  }, [playing]);

  const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.currentTime = val;
    setCurrentTime(val);
  }, []);

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="bg-cream border border-sand/50 p-6">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Eyebrow */}
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
        {durationLabel(audioDuration)}
      </p>

      {/* Title */}
      <p className="font-[family-name:var(--font-display)] text-[20px] leading-[1.3] text-ink mb-6">
        {title}
      </p>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={[
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            "border border-sand/60 transition-colors duration-200",
            playing
              ? "bg-plum text-cream hover:bg-plum-deep border-plum"
              : "bg-cream text-ink hover:bg-bone",
          ].join(" ")}
        >
          {playing ? (
            /* Pause icon */
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
              <rect x="0" y="0" width="4" height="16" rx="1" />
              <rect x="10" y="0" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg width="13" height="15" viewBox="0 0 13 15" fill="currentColor" aria-hidden>
              <path d="M1 1.5l11 6-11 6V1.5z" />
            </svg>
          )}
        </button>

        {/* Progress track */}
        <div className="flex-1 relative">
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-plum -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
          <input
            type="range"
            min={0}
            max={audioDuration || 1}
            step={0.5}
            value={currentTime}
            onChange={onSeek}
            aria-label="Seek"
            className="w-full h-[3px] appearance-none cursor-pointer rounded-full bg-sand/50 relative z-10"
            style={{
              // Transparent track so the plum fill div shows through
              background: "transparent",
            }}
          />
        </div>

        {/* Time */}
        <p className="text-[13px] text-ink-quiet tabular-nums flex-shrink-0 select-none">
          {formatTime(currentTime)}&thinsp;/&thinsp;{formatTime(audioDuration)}
        </p>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mt-6 border-t border-sand/40 pt-5">
          <button
            type="button"
            onClick={() => setTranscriptOpen((o) => !o)}
            className="flex items-center gap-2 text-[13px] text-ink-quiet hover:text-ink transition-colors"
            aria-expanded={transcriptOpen}
          >
            <span
              className="inline-block transition-transform duration-200"
              aria-hidden
              style={{ transform: transcriptOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              ›
            </span>
            {transcriptOpen ? "Hide transcript" : "Read transcript"}
          </button>
          {transcriptOpen && (
            <div className="mt-4 border border-sand/40 bg-bone p-5">
              <p className="text-[15px] leading-[1.75] text-ink-soft whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
