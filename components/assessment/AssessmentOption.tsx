"use client";

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

export function AssessmentOption({ label, selected, onSelect, index }: Props) {
  const letters = ["A", "B", "C", "D"];
  const letter = letters[index] ?? String(index + 1);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group w-full text-left px-6 py-5 transition-all duration-200 rounded-[1px]",
        "flex items-start gap-5 border",
        selected
          ? "bg-wine border-wine text-cream"
          : "bg-cream border-sand hover:border-ink-quiet hover:bg-bone text-ink-soft",
      ].join(" ")}
    >
      <span
        className={[
          "shrink-0 w-6 h-6 flex items-center justify-center text-[11px] tracking-[0.15em] font-medium mt-[1px] border rounded-[1px] transition-colors duration-200",
          selected
            ? "border-cream/40 text-cream/80"
            : "border-sand text-ink-quiet group-hover:border-ink-quiet",
        ].join(" ")}
      >
        {letter}
      </span>
      <span className="text-[16px] leading-[1.6] font-[family-name:var(--font-body)]">
        {label}
      </span>
    </button>
  );
}
