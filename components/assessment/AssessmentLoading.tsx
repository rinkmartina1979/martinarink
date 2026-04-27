"use client";

export function AssessmentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] gap-8 animate-[fadeUp_0.5s_ease-out_both]">
      {/* Minimal pulsing line — editorial, not a spinner */}
      <div className="flex gap-2 items-end h-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[2px] bg-pink rounded-full animate-pulse"
            style={{
              height: i === 1 ? "24px" : "14px",
              animationDelay: `${i * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="font-[family-name:var(--font-display)] italic text-[20px] text-ink leading-snug">
          Reading your answers.
        </p>
        <p className="mt-2 text-[14px] text-ink-quiet">
          Your letter is being written.
        </p>
      </div>
    </div>
  );
}
