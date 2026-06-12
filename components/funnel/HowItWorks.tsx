/**
 * HowItWorks — "The path" section.
 *
 * Placed late on the homepage, just before the closing CTA — after desire
 * has been built, not before. No prices, no time-stamps, no funnel furniture.
 * Four quiet steps in the brand voice.
 */

const STEPS = [
  {
    number: "01",
    title: "Begin the assessment",
    body: "Seven questions, answered privately. A letter follows — written for where you actually are.",
    href: "/assessment",
    cta: "Begin →",
  },
  {
    number: "02",
    title: "Receive your private letter",
    body: "Not a category. Not a score. A reading of where you stand — and what the work would be.",
    href: null,
    cta: null,
  },
  {
    number: "03",
    title: "Apply",
    body: "Five honest questions. I read every application personally and reply within 48 hours.",
    href: null,
    cta: null,
  },
  {
    number: "04",
    title: "We speak privately",
    body: "A private conversation, offered after your application is accepted.",
    href: null,
    cta: null,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-cream border-t border-sand/40 py-16 md:py-20">
      <div className="container-content">

        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <span className="h-px w-10 bg-pink shrink-0" aria-hidden />
          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-quiet font-[family-name:var(--font-body)]">
            The path
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-0 md:divide-x divide-sand/40">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={[
                "relative py-6 md:py-0",
                i > 0 ? "md:pl-8 lg:pl-10" : "",
                i < STEPS.length - 1 ? "border-b md:border-b-0 border-sand/40" : "",
              ].join(" ")}
            >
              {/* Step number */}
              <p className="text-[11px] tracking-[0.28em] uppercase text-ink-quiet font-[family-name:var(--font-body)] mb-4">
                {step.number}
              </p>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-display)] text-[20px] leading-[1.2] text-ink mb-3">
                {step.title}
              </h3>

              {/* Body */}
              <p className="text-[14px] leading-[1.7] text-ink-soft">
                {step.body}
              </p>

              {/* CTA — step 01 only */}
              {step.cta && step.href && (
                <a
                  href={step.href}
                  className="mt-5 inline-flex items-center text-[12px] uppercase tracking-[0.18em] text-plum font-medium hover:text-pink transition-colors duration-200 font-[family-name:var(--font-body)]"
                >
                  {step.cta}
                </a>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
