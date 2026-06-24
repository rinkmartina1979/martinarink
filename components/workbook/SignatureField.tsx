"use client";

import { cn } from "@/lib/utils";

interface SignatureFieldProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

/**
 * Typed-name signature field rendered in Dancing Script.
 * No canvas drawing — the typed name is the signature.
 */
export function SignatureField({ id, value, onChange, onBlur }: SignatureFieldProps) {
  return (
    <div className="space-y-2">
      <input
        id={id}
        type="text"
        maxLength={120}
        placeholder="Type your name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "w-full px-5 py-4 bg-cream border border-sand text-ink placeholder-ink-quiet/40",
          "font-[family-name:var(--font-script)] text-[28px] leading-[1.3]",
          "focus:outline-none focus:border-plum rounded-[1px] transition-colors duration-200",
        )}
        aria-label="Your signature — type your name"
        autoComplete="name"
      />
      {value.trim().length > 0 && (
        <p className="text-[11px] text-ink-quiet font-[family-name:var(--font-body)] tracking-[0.06em]">
          This is your signature.
        </p>
      )}
      {/* Hairline rule below — reinforces the "signing line" metaphor */}
      <div className="border-b border-sand/70 mt-1" aria-hidden="true" />
    </div>
  );
}
