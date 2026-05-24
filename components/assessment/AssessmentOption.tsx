"use client";

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

const LETTERS = ["A", "B", "C", "D"] as const;

export function AssessmentOption({ label, selected, onSelect, index }: Props) {
  const letter = LETTERS[index] ?? String(index + 1);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        /* Layout */
        "group w-full text-left flex items-start gap-4",
        /* Box */
        "px-5 py-[18px] border transition-all duration-200 rounded-[1px] cursor-pointer",
        /* States */
        selected
          ? "bg-plum border-plum text-cream shadow-[0_2px_12px_rgba(92,45,142,0.18)]"
          : "bg-cream border-sand text-ink-soft hover:border-plum/40 hover:bg-blush/50",
      ].join(" ")}
    >
      {/* Letter badge */}
      <span
        className={[
          "shrink-0 mt-[2px] w-[26px] h-[26px] flex items-center justify-center",
          "text-[11px] tracking-[0.12em] font-semibold border rounded-[2px]",
          "transition-all duration-200 font-[family-name:var(--font-body)]",
          selected
            ? "border-cream/30 bg-cream/10 text-cream"
            : "border-sand text-ink-quiet group-hover:border-plum/40 group-hover:text-plum",
        ].join(" ")}
        aria-hidden
      >
        {letter}
      </span>

      {/* Label */}
      <span className="text-[15px] md:text-[16px] leading-[1.6] font-[family-name:var(--font-body)]">
        {label}
      </span>
    </button>
  );
}
