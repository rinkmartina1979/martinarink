"use client";

interface Props {
  onBegin: () => void;
}

export function AssessmentIntro({ onBegin }: Props) {
  return (
    <div className="w-full animate-[fadeUp_0.5s_ease-out_both]">

      {/* Editorial eyebrow */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px w-8 bg-pink shrink-0" />
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet font-[family-name:var(--font-body)]">
          Ten questions — five minutes
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-[family-name:var(--font-display)] text-[28px] md:text-[36px] leading-[1.15] text-ink mb-8">
        Discover the version of yourself<br className="hidden md:block" /> that is waiting.
      </h2>

      <div className="space-y-5 max-w-[480px]">
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          Each question has one answer — the one that feels closest to true,
          not the one you wish were true.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          There are no wrong answers. There is only where you are.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          At the end: a private letter written for where you are right now —
          and a clear sense of what comes next.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-5">
        <button
          type="button"
          onClick={onBegin}
          className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
        >
          Begin
        </button>
        <span className="text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
          Private &middot; Confidential
        </span>
      </div>

    </div>
  );
}
