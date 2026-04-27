import { buildMetadata } from "@/lib/metadata";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";

export const metadata = buildMetadata({
  title: "Points of Departure — A Private Assessment",
  description:
    "Seven questions. About four minutes. At the end, a letter — written specifically for where you are. Not a quiz. A beginning.",
  path: "/assessment",
});

export default function AssessmentPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-ink pt-32 md:pt-44 pb-20 md:pb-28 relative overflow-hidden">
        {/* Subtle texture line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink/30 to-transparent" />

        <div className="container-content max-w-2xl mx-auto px-6">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-6 bg-pink" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-pink-soft/80 font-[family-name:var(--font-body)]">
              A private assessment
            </span>
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-display)] text-[42px] md:text-[58px] leading-[1.05] text-cream">
            Points of{" "}
            <span className="font-[family-name:var(--font-script)] text-[1.1em] text-pink leading-none">
              Departure
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-[17px] md:text-[19px] leading-[1.7] text-cream/80 max-w-lg">
            A private diagnostic for the woman who knows something has shifted —
            and wants to understand exactly where she stands.
          </p>

          {/* Divider */}
          <div className="mt-10 flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-pink/20 to-transparent" />
            <span className="text-[12px] tracking-[0.2em] uppercase text-cream/40">
              Seven questions
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-pink/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT SHELL ─────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content max-w-2xl mx-auto px-6">
          <AssessmentShell />
        </div>
      </section>

      {/* ── PRIVACY NOTE ─────────────────────────────────────────── */}
      <section className="bg-bone py-12 border-t border-sand">
        <div className="container-content max-w-2xl mx-auto px-6 text-center">
          <p className="text-[13px] leading-[1.7] text-ink-quiet max-w-md mx-auto">
            Your answers are private and used only to personalise your result.
            Submitting your email adds you to Martina&rsquo;s private list.
            You can unsubscribe at any time — one click, no friction.
          </p>
        </div>
      </section>
    </>
  );
}
