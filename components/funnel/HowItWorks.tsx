/**
 * HowItWorks — Homepage conversion clarity section
 *
 * 4-step process. Placed immediately after the hero.
 * Answers the #1 question a high-intent visitor has:
 * "Okay — but what do I actually DO?"
 *
 * No decoration. No fluff. Just the path, clearly stated.
 */

const STEPS = [
  {
    number: "01",
    title: "Take the assessment",
    body: "Ten questions. Five minutes. Tells you — and me — exactly where you are and what you need.",
    time: "5 min",
    href: "/assessment",
    cta: "Begin →",
  },
  {
    number: "02",
    title: "Receive your private letter",
    body: "A letter written for where you actually are. Not a category. Not a score. A beginning.",
    time: "Immediate",
    href: null,
    cta: null,
  },
  {
    number: "03",
    title: "Apply for the programme",
    body: "Five honest questions. I read every application personally. Reply within 48 hours.",
    time: "10 min",
    href: null,
    cta: null,
  },
  {
    number: "04",
    title: "We speak privately",
    body: "A 45-minute consultation — €350, credited in full to the programme if we proceed together.",
    time: "45 min · €350",
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
            How it works
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
              <p className="text-[11px] tracking-[0.28em] uppercase text-pink font-[family-name:var(--font-body)] mb-4">
                {step.number}
              </p>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-display)] text-[20px] leading-[1.2] text-ink mb-3">
                {step.title}
              </h3>

              {/* Body */}
              <p className="text-[14px] leading-[1.7] text-ink-soft mb-5">
                {step.body}
              </p>

              {/* Time/meta */}
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-quiet/70 font-[family-name:var(--font-body)]">
                {step.time}
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

              {/* Active indicator — step 01 */}
              {i === 0 && (
                <span
                  aria-hidden
                  className="absolute top-0 left-0 md:top-auto md:bottom-0 h-full md:h-px w-px md:w-full bg-pink/30"
                />
              )}
            </div>
          ))}
        </div>

        {/* Connecting arrow — desktop */}
        <div className="hidden md:flex justify-between mt-6 px-0" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 flex justify-end pr-4">
              <span className="text-sand text-[18px] translate-y-1">→</span>
            </div>
          ))}
          <div className="flex-1" />
        </div>

      </div>
    </section>
  );
}
