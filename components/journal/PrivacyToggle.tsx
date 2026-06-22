"use client";

import { cn } from "@/lib/utils";
import { VISIBILITY_OPTIONS, type Visibility } from "@/lib/journal/prompts";

/**
 * Three-state privacy control for a journal entry.
 * Default is "private". Plain-language helper text under the selected option.
 */
export function PrivacyToggle({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const selected = VISIBILITY_OPTIONS.find((o) => o.value === value);

  return (
    <fieldset className="border border-sand/60 bg-cream p-5 rounded-[1px]">
      <legend className="px-2 text-[10px] uppercase tracking-[0.26em] text-ink-quiet font-[family-name:var(--font-body)]">
        This entry is
      </legend>
      <div className="flex flex-col sm:flex-row gap-2 mt-2" role="radiogroup" aria-label="Entry visibility">
        {VISIBILITY_OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 px-4 py-3 text-[13px] tracking-[0.04em] rounded-[1px] border cursor-pointer transition-colors duration-200",
                active
                  ? "bg-aubergine text-cream border-aubergine"
                  : "bg-cream text-ink-soft border-sand hover:border-aubergine",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mt-3 text-[13px] leading-[1.6] text-ink-quiet font-[family-name:var(--font-body)]">
          {selected.helper}
        </p>
      )}
    </fieldset>
  );
}
