import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Intake received",
  noIndex: true,
});

/**
 * /thank-you/intake — post-submit confirmation for ClientIntakeForm.
 *
 * NOT the same audience as /thank-you/application. By the time a client
 * reaches this form she has already been accepted and has already signed
 * the coaching contract (see app/accept-sent/page.tsx) — the acceptance
 * decision is behind her, not ahead of her. This page must never repeat
 * application-under-review language ("I read every application myself",
 * "within 48 hours", "if I don't think it's the right fit") — that copy
 * belongs to the pre-acceptance form only and would read as if her place
 * were still in question after she has already paid and signed.
 */
export default function IntakeThankYouPage() {
  return (
    <section className="bg-cream pt-32 md:pt-40 pb-24 min-h-screen flex items-center">
      <div className="container-content max-w-2xl mx-auto text-center">
        <Eyebrow className="justify-center" withLine>
          Received
        </Eyebrow>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[42px] md:text-[56px] leading-[1.08] text-ink">
          Your intake is complete.
        </h1>
        <ScriptAccent className="block mt-8 text-[40px] text-plum">
          welcome.
        </ScriptAccent>
        <p className="mt-10 text-[17px] leading-[1.75] text-ink-soft">
          Everything you shared is confidential and read by me alone. It is
          used only to prepare for our work together.
        </p>
        <p className="mt-5 text-[17px] leading-[1.75] text-ink-soft">
          If you have not yet booked your first session, the link is in the
          acceptance email I sent you. If you have, I will see you there.
        </p>
        <Link
          href="/writing"
          className="mt-12 inline-block text-[14px] text-plum underline decoration-pink underline-offset-4"
        >
          Read while you wait →
        </Link>
      </div>
    </section>
  );
}
