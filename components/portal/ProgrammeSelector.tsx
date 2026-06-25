"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PROGRAMME_VARIANTS,
  getBalance,
  formatEur,
  DEPOSIT,
  type ProgrammeVariantKey,
  type ProgrammeVariant,
} from "@/lib/pricing";

type FlowState = "idle" | "saving" | "redirecting" | "error";

interface ProgrammeSelectorProps {
  token: string;
  /** Broad programme key (sober-muse / empowerment) — filters which tiers show. */
  programme: string | null;
  /** Currently stored tier, if any. */
  currentVariant?: string | null;
}

/** Tiers for this client's programme, paired with their keys. */
function tiersFor(programme: string | null): Array<[ProgrammeVariantKey, ProgrammeVariant]> {
  return (Object.entries(PROGRAMME_VARIANTS) as Array<[ProgrammeVariantKey, ProgrammeVariant]>).filter(
    ([, v]) => v.programme === programme && v.programme !== "consultation",
  );
}

export function ProgrammeSelector({ token, programme, currentVariant }: ProgrammeSelectorProps) {
  const tiers = tiersFor(programme);
  const [selected, setSelected] = useState<ProgrammeVariantKey | null>(
    (currentVariant as ProgrammeVariantKey) ?? null,
  );
  const [state, setState] = useState<FlowState>("idle");

  if (tiers.length === 0) {
    return (
      <p className="text-[14px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]">
        Your programme details will appear here shortly.
      </p>
    );
  }

  async function choose(key: ProgrammeVariantKey) {
    setSelected(key);
    setState("saving");
    try {
      const res = await fetch("/api/members/select-programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, variantKey: key }),
      });
      setState(res.ok ? "idle" : "error");
    } catch {
      setState("error");
    }
  }

  async function payBalance() {
    if (!selected || state === "redirecting") return;
    setState("redirecting");
    try {
      const res = await fetch("/api/checkout/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, variantKey: selected }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setState("error");
    } catch {
      setState("error");
    }
  }

  const selectedVariant = selected ? PROGRAMME_VARIANTS[selected] : null;
  const balance = selectedVariant ? getBalance(selectedVariant) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-1">Your programme</p>
        <p className="text-[14px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)] max-w-md">
          Choose the format we agreed in your consultation. Your €{DEPOSIT} deposit is credited toward it.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Programme format">
        {tiers.map(([key, v]) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => void choose(key)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-[1px] border transition-colors duration-200 cursor-pointer",
                "flex items-baseline justify-between gap-4",
                isSelected
                  ? "bg-cream border-plum"
                  : "bg-cream border-sand hover:border-ink-soft",
              )}
            >
              <span>
                <span className="block text-[15px] text-ink font-[family-name:var(--font-body)]">
                  {v.label}
                </span>
                {v.sublabel && (
                  <span className="block text-[13px] text-ink-quiet mt-0.5">{v.sublabel}</span>
                )}
              </span>
              <span className="flex-shrink-0 text-[15px] text-ink font-[family-name:var(--font-body)]">
                {formatEur(v.total)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedVariant && balance !== null && (
        <div className="pt-2 border-t border-sand/30">
          <div className="flex items-baseline justify-between gap-4 mb-5 pt-4">
            <span className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
              Balance after deposit
            </span>
            <span className="text-[15px] text-ink font-[family-name:var(--font-body)]">
              {formatEur(balance)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void payBalance()}
            disabled={state === "redirecting"}
            className="px-8 py-3 bg-plum text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-plum-deep transition-colors duration-200 disabled:opacity-60"
          >
            {state === "redirecting" ? "Opening checkout…" : `Pay balance — ${formatEur(balance)}`}
          </button>
          {state === "error" && (
            <p className="mt-3 text-[13px] text-pink font-[family-name:var(--font-body)]">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="mt-4 text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
            You will be taken to Stripe to pay securely, then returned here.
          </p>
        </div>
      )}
    </div>
  );
}
