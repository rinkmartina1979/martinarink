import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Cancellation Policy & Withdrawal Form",
    description: "Cancellation policy and statutory withdrawal form for consumers — Concept Studio Martina Rink UG.",
    path: "/legal/cancellation",
    noIndex: false,
  });
}

export default function CancellationPage() {
  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-2">
          Cancellation Policy
        </h1>
        <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-12">
          Concept Studio Martina Rink UG (haftungsbeschränkt) &middot; January 2025
        </p>

        <div className="space-y-10 text-[16px] leading-[1.75] text-ink-soft">

          <section>
            <p>
              This cancellation policy applies to consumers — any natural person who enters into
              a legal transaction for purposes that cannot be attributed predominantly to a
              commercial or self-employed professional activity.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">
              Right of Withdrawal
            </h2>
            <p className="mb-4">
              You have the right to withdraw from this contract within 14 days without giving any reason.
              The withdrawal period is 14 days from the day of conclusion of the contract.
            </p>
            <p className="mb-4">
              To exercise the right of withdrawal, you must inform us by means of a clear declaration
              (e.g. a letter sent by post, or an email):
            </p>
            <address className="not-italic space-y-1 bg-bone border border-sand/50 p-6 mb-4">
              <p className="font-medium text-ink">Concept Studio Martina Rink UG (haftungsbeschränkt)</p>
              <p>Steinkreuzstr. 26b</p>
              <p>76228 Karlsruhe, Germany</p>
              <p>Phone: +49 172 174 1499</p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-plum underline underline-offset-4"
                >
                  {SITE.email}
                </a>
              </p>
            </address>
            <p>
              You may use the withdrawal form below, though it is not obligatory.
              To meet the withdrawal deadline, it is sufficient for you to send your notification
              before the withdrawal period has expired.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">
              Consequences of Withdrawal
            </h2>
            <p className="mb-4">
              If you withdraw from this contract, we will reimburse all payments we have received
              from you, without undue delay and no later than 14 days from the day we receive
              notification of your withdrawal. We will use the same means of payment you used for
              the original transaction, unless expressly agreed otherwise. You will not incur any
              fees for this reimbursement.
            </p>
            <p>
              If you requested that the services begin during the withdrawal period, you must pay
              us a reasonable amount corresponding to the proportion of services already provided
              up to the point of withdrawal, relative to the total contractual scope.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">
              Expiry of the Right of Withdrawal
            </h2>
            <p>
              The right of withdrawal expires prematurely if the Provider has fully performed
              the service and the performance only began after you gave your express prior consent
              and your acknowledgement that you would lose your right of withdrawal upon full
              performance.
            </p>
          </section>

          {/* ── Withdrawal Form ──────────────────────────────────────── */}
          <section className="border-t border-sand/50 pt-10">
            <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-2">
              Model Withdrawal Form
            </h2>
            <p className="text-[14px] text-ink-quiet mb-6">
              (Complete and return this form only if you wish to withdraw from the contract.)
            </p>

            <div className="bg-bone border border-sand/50 p-8 space-y-5 text-[15px]">
              <p>To:</p>
              <address className="not-italic space-y-1">
                <p>Concept Studio Martina Rink UG (haftungsbeschränkt)</p>
                <p>Steinkreuzstr. 26b, 76228 Karlsruhe, Germany</p>
                <p>
                  <a href={`mailto:${SITE.email}`} className="text-plum underline underline-offset-4">
                    {SITE.email}
                  </a>
                </p>
              </address>

              <p className="pt-2">
                I/We (*) hereby withdraw from the contract I/we (*) concluded for the provision
                of the following service:
              </p>
              <p className="border-b border-sand/60 pb-2 text-ink-quiet">
                (Description of service, e.g. coaching session or coaching package)
              </p>

              <div className="space-y-4 pt-2">
                <p>
                  Ordered on: <span className="inline-block w-48 border-b border-sand/60">&nbsp;</span>
                </p>
                <p>
                  Consumer name: <span className="inline-block w-64 border-b border-sand/60">&nbsp;</span>
                </p>
                <p>
                  Consumer address: <span className="inline-block w-64 border-b border-sand/60">&nbsp;</span>
                </p>
                <div className="pt-4 space-y-2">
                  <p className="border-b border-sand/60 pb-1">&nbsp;</p>
                  <p className="text-[13px] text-ink-quiet">Date, Signature (only for paper submission)</p>
                </div>
              </div>

              <p className="text-[13px] text-ink-quiet pt-2">(*) Delete as applicable.</p>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
