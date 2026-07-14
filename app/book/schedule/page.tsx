import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { CalComEmbed } from "@/components/book/CalComEmbed";
import { DepositPaidTracker } from "@/components/book/DepositPaidTracker";

export const metadata = buildMetadata({ noIndex: true });

interface SchedulePageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BookSchedulePage({ searchParams }: SchedulePageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/book?expired=1");
  }

  // Verify Stripe session
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    redirect("/book?payment_error=1");
  }

  let paymentStatus: string | null = null;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`,
      {
        headers: {
          Authorization: `Bearer ${stripeKey}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      redirect("/book?payment_error=1");
    }

    const session = await res.json();
    paymentStatus = session.payment_status ?? null;
  } catch {
    redirect("/book?payment_error=1");
  }

  if (paymentStatus !== "paid") {
    redirect("/book?payment_error=1");
  }

  const calcomUrl =
    process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com/martinarink/30min";

  return (
    <>
      <DepositPaidTracker />

      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-40 pb-12">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center" withLine>
            Your deposit is confirmed
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink">
            Choose a time that suits you.
          </h1>
          <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
            I look forward to our conversation. The €350 is confirmed — it applies
            in full toward the programme if you proceed.
          </p>
        </div>
      </section>

      {/* ── Cal.com embed ─────────────────────────────────────── */}
      <section className="bg-cream pb-24">
        <div className="container-content max-w-3xl mx-auto">
          <div className="bg-bone p-2">
            <CalComEmbed url={calcomUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
