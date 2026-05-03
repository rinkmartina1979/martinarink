"use client";

import { useEffect } from "react";
import { GhostButton } from "@/components/brand/GhostButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <section className="bg-cream min-h-screen flex items-center pt-24 pb-24">
      <div className="container-content max-w-xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
          Something went wrong
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[40px] leading-tight text-ink">
          Something went wrong.
        </h1>
        <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">
          An unexpected error occurred. Please try again, or return to the
          homepage.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
          >
            Try again
          </button>
          <GhostButton href="/">Return home</GhostButton>
        </div>
      </div>
    </section>
  );
}
