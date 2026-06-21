/**
 * /test/stripe/success — Post-payment confirmation for smoke tests.
 * Noindex. Shows the session ID + next verification steps.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment received — smoke test",
  robots: { index: false, follow: false },
};

export default async function StripeTestSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; amount?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id ?? "—";
  const amountCents = parseInt(params.amount ?? "100", 10);
  const amountLabel = amountCents === 500 ? "€5.00" : "€1.00";

  return (
    <main className="min-h-screen bg-bone flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-cream border border-sand/60 p-10 space-y-8">

        {/* Status */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-mint flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#1E1B17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-quiet">Payment received</p>
            <p className="text-[18px] font-[family-name:var(--font-display)] text-ink">
              {amountLabel} charged
            </p>
          </div>
        </div>

        {/* Session ID */}
        <div className="bg-bone border border-sand/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Stripe session ID</p>
          <p className="text-[12px] font-mono text-ink break-all">{sessionId}</p>
        </div>

        <p className="text-[14px] leading-[1.7] text-ink-soft">
          The webhook has fired. Allow 5–10 seconds for the email and Brevo
          contact to appear. Now verify each step below.
        </p>

        {/* Verification steps */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
            Verify in order
          </p>

          {[
            {
              step: "1",
              label: "Stripe — Payment confirmed",
              detail: "Dashboard → Payments → find the session ID above → status: Paid",
              href: "https://dashboard.stripe.com/payments",
              linkLabel: "Open Stripe →",
            },
            {
              step: "2",
              label: "Stripe — Webhook delivered",
              detail: "Developers → Webhooks → your endpoint → recent events → checkout.session.completed → HTTP 200",
              href: "https://dashboard.stripe.com/webhooks",
              linkLabel: "Open webhooks →",
            },
            {
              step: "3",
              label: "Resend — Confirmation email sent",
              detail: "'Deposit received — consultation confirmed' should be in your inbox and in Resend logs",
              href: "https://resend.com/emails",
              linkLabel: "Open Resend →",
            },
            {
              step: "4",
              label: "Brevo — Contact updated",
              detail: "Contacts → find your test email → DEPOSIT_PAID = true, DEPOSIT_PAID_AT set",
              href: "https://app.brevo.com/contact/list",
              linkLabel: "Open Brevo →",
            },
            {
              step: "5",
              label: "Stripe — Issue refund",
              detail: "Dashboard → Payments → find session → Refund",
              href: "https://dashboard.stripe.com/payments",
              linkLabel: "Refund now →",
            },
          ].map(({ step, label, detail, href, linkLabel }) => (
            <div key={step} className="flex gap-4 items-start border-b border-sand/30 pb-4 last:border-0">
              <span className="shrink-0 w-6 h-6 border border-sand/60 flex items-center justify-center text-[10px] text-ink-quiet font-mono mt-0.5">
                {step}
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-ink font-medium leading-snug">{label}</p>
                <p className="text-[12px] text-ink-quiet mt-0.5 leading-[1.6]">{detail}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1.5 text-[11px] uppercase tracking-[0.15em] text-plum hover:text-plum-deep transition-colors"
                >
                  {linkLabel}
                </a>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/test/stripe"
          className="block text-center text-[11px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
        >
          ← Run another test
        </a>

      </div>
    </main>
  );
}
