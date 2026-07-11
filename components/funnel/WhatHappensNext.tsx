/**
 * WhatHappensNext — shown on the assessment result page
 *
 * The #1 anxiety at this moment: "I've read my result, now what?"
 * This answers it with zero ambiguity. Three steps, in plain language.
 * Placed directly above the CTA so they read it right before clicking.
 */

interface Props {
  readinessLevel: "high" | "medium" | "low";
}

export function WhatHappensNext({ readinessLevel }: Props) {
  const isLow = readinessLevel === "low";

  const steps = isLow
    ? [
        {
          n: "01",
          title: "Reserve your consultation",
          body: "A 45-minute private conversation. €350, credited to the programme if you continue.",
        },
        {
          n: "02",
          title: "We speak — honestly",
          body: "About where you are, what you are considering, and whether this is the right fit.",
        },
        {
          n: "03",
          title: "You decide what comes next",
          body: "No pressure. The decision is entirely yours, and it will wait until it is ready.",
        },
      ]
    : [
        {
          n: "01",
          title: "Submit your application",
          body: "Five honest questions. Takes about ten minutes. I read every one personally.",
        },
        {
          n: "02",
          title: "I reply within 48 hours",
          body: "If we are the right fit, you receive a private booking link in that email.",
        },
        {
          n: "03",
          title: "We speak privately",
          body: "A 45-minute conversation. €350, applied to the programme if you proceed.",
        },
      ];

  return (
    <section className="bg-bone border-t border-sand py-14 md:py-16">
      <div className="container-content max-w-[640px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-8 bg-pink shrink-0" aria-hidden />
          <p className="text-[11px] uppercase tracking-[0.26em] text-ink-quiet font-[family-name:var(--font-body)]">
            What happens next
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.n} className="flex gap-5">
              {/* Number + vertical connector */}
              <div className="flex flex-col items-center">
                <span className="shrink-0 w-7 h-7 rounded-full bg-ink flex items-center justify-center text-[10px] text-cream font-semibold font-[family-name:var(--font-body)]">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className="w-px flex-1 bg-sand/60 mt-2" aria-hidden />
                )}
              </div>

              {/* Content */}
              <div className={i < steps.length - 1 ? "pb-8" : ""}>
                <p className="font-[family-name:var(--font-display)] text-[17px] text-ink mb-1">
                  {step.title}
                </p>
                <p className="text-[14px] leading-[1.7] text-ink-soft">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance footnote */}
        <p className="mt-10 text-[12px] leading-[1.7] text-ink-quiet border-l border-sand/60 pl-4 italic font-[family-name:var(--font-display)]">
          {isLow
            ? "The consultation is a genuine conversation — not a sales call. Nothing is decided until you are ready."
            : "The application is short. The conversation is private. Nothing is committed until you choose to proceed."}
        </p>

      </div>
    </section>
  );
}
