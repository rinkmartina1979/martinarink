/**
 * /members/[token]/welcome?session_id=cs_...
 *
 * Landing page immediately after a programme-balance or first-instalment
 * payment. Stripe is the only source of truth here — the session_id query
 * param is never trusted on its own. We retrieve the session server-side,
 * confirm it actually paid, and confirm it belongs to this token's client
 * before rendering anything. Any mismatch redirects to billing, where the
 * existing BillingCard reflects the real (webhook-derived) entitlement.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { verifyMemberToken } from "@/lib/members/token";
import { stripe, hasStripe } from "@/lib/stripe";
import { getVariant } from "@/lib/pricing";

export const metadata = buildMetadata({ noIndex: true });

interface WelcomePageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function WelcomePage({ params, searchParams }: WelcomePageProps) {
  const { token } = await params;
  const { session_id: sessionId } = await searchParams;

  const payload = verifyMemberToken(token);
  if (!payload || !sessionId || !hasStripe(stripe)) {
    redirect(`/members/${token}/billing`);
  }

  let variantKey: string | null = null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.mode === "subscription") {
      const subscription =
        typeof session.subscription === "string" ? null : session.subscription;
      const meta = subscription?.metadata as { clientId?: string; variantKey?: string } | undefined;
      if (!subscription || meta?.clientId !== payload.clientId) {
        redirect(`/members/${token}/billing`);
      }
      variantKey = meta?.variantKey ?? null;
    } else {
      const meta = session.metadata as { clientId?: string; variantKey?: string } | null;
      if (session.payment_status !== "paid" || meta?.clientId !== payload.clientId) {
        redirect(`/members/${token}/billing`);
      }
      variantKey = meta?.variantKey ?? null;
    }
  } catch {
    redirect(`/members/${token}/billing`);
  }

  const variant = getVariant(variantKey);

  return (
    <div className="bg-cream min-h-screen flex items-center">
      <section className="w-full py-28 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            {variant?.label ?? "Your programme"}
          </p>
          <p className="font-[family-name:var(--font-display)] text-[34px] md:text-[42px] text-ink leading-[1.1] mb-8">
            Your programme begins.
          </p>
          <p className="text-[15px] leading-[1.75] text-ink-soft mb-4">
            Your payment is confirmed. In the next 48 hours you will receive a
            note from me with your foundation workbook and how our first
            weeks together will run.
          </p>
          <p className="text-[15px] leading-[1.75] text-ink-soft mb-12">
            You do not need to wait for that note to begin — the first section
            of your workbook is open now, whenever you are ready.
          </p>
          <Link
            href={`/members/${token}/workbook/becoming`}
            className="inline-block px-8 py-3 bg-plum text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
          >
            Open your workbook
          </Link>
          <p className="mt-8">
            <Link
              href={`/members/${token}`}
              className="text-[13px] text-ink-quiet hover:text-ink transition-colors"
            >
              Go to your portal
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
