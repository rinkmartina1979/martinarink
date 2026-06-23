import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CalendlyEmbed } from "@/components/book/CalendlyEmbed";
import { SessionRequestForm } from "@/components/portal/SessionRequestForm";

export const metadata = buildMetadata({ noIndex: true });

interface SchedulePageProps {
  params: Promise<{ token: string }>;
}

function ExpiredPage() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-[family-name:var(--font-script)] text-[32px] text-pink leading-none mb-6">
          Unavailable.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          This link has expired or is no longer active. You can request a fresh one at{" "}
          <Link
            href="/portal"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            martinarink.com/portal
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <ExpiredPage />;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let valid = false;
  try {
    const res = await fetch(`${baseUrl}/api/members/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    const data = await res.json();
    valid = data.valid === true;
  } catch {
    return <ExpiredPage />;
  }

  if (!valid) return <ExpiredPage />;

  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/martinarink";

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <Link
          href={`/members/${token}`}
          className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <section className="max-w-3xl mx-auto px-6 pb-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Schedule</p>
        <h1 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] text-ink leading-none mb-4">
          Book a session.
        </h1>
        <p className="text-[17px] leading-[1.75] text-ink-soft max-w-lg">
          Choose a time that suits you below. Sessions are 45–60 minutes. If nothing fits, send a request and Martina will find a time with you.
        </p>
      </section>

      {/* Calendly embed */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <CalendlyEmbed url={calendlyUrl} />
      </section>

      {/* Hairline divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-sand/40" />
      </div>

      {/* Request form */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
          Or send a request
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink leading-snug mb-2">
          Prefer Martina to arrange it?
        </h2>
        <p className="text-[15px] text-ink-soft leading-[1.7] mb-8">
          Let her know what you need and she will come back to you with a time.
        </p>
        <SessionRequestForm token={token} />
      </section>
    </div>
  );
}
