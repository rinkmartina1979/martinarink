"use client";

import { useEffect, useState } from "react";

/**
 * ReadingProgressBar — thin pink line at the top that fills as the user scrolls.
 * Add to any long-form page (article, programme pages).
 * Must be rendered client-side; lives inside the Nav or at top of <body>.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 z-[60] h-[2px] bg-pink origin-left transition-transform duration-100"
      style={{ width: "100%", transform: `scaleX(${progress / 100})` }}
    />
  );
}
