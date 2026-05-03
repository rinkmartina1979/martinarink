"use client";

interface Props {
  onBegin: () => void;
}

export function AssessmentIntro({ onBegin }: Props) {
  return (
    <div className="w-full animate-[fadeUp_0.5s_ease-out_both]">
      {/* Editorial details */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-[1px] w-8 bg-pink" />
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet">
          Seven questions — four minutes
        </span>
      </div>

      <div className="space-y-5 max-w-lg">
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          Each question has one answer — the one that lands closest to true,
          not the one you wish were true.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          There are no wrong answers. There is only where you are.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          At the end: a letter. Written for where you are, not for where
          you think you should be.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBegin}
          className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
        >
          Begin
        </button>
        <span className="text-[13px] text-ink-quiet">
          Private. Confidential.
        </span>
      </div>
    </div>
  );
}
