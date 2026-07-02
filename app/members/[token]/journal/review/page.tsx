import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { verifyPortalAccess } from "@/lib/members/portalAuth";
import { getMonthlyReview } from "@/sanity/lib/membersQueries";
import { MonthlyReviewForm } from "@/components/journal/MonthlyReviewForm";
import { toDateKey, monthIndexFor, type Visibility } from "@/lib/journal/prompts";
import { LinkExpiredView } from "@/components/portal/LinkExpiredView";

export const metadata = buildMetadata({ noIndex: true });

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function MonthlyReviewPage({ params }: PageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <LinkExpiredView />;

  const access = await verifyPortalAccess(token);
  if (!access) return <LinkExpiredView />;

  const { clientId, profile } = access;
  const today = toDateKey(new Date());
  const monthIndex = profile.enrolledAt ? monthIndexFor(profile.enrolledAt, today) : 1;

  const review = await getMonthlyReview(clientId, monthIndex);

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 md:pt-36 pb-8 px-6 border-b border-sand/30">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/members/${token}/journal`}
            className="text-[13px] text-ink-quiet hover:text-ink transition-colors"
          >
            ← Journal
          </Link>
          <Eyebrow className="mt-6 mb-4">Monthly review</Eyebrow>
          <p className="font-[family-name:var(--font-display)] text-[34px] text-ink leading-tight">
            Month {monthIndex} of 3
          </p>
          <p className="mt-4 text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
            A slower look back. Take what you have done, what helped, and what comes next.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <MonthlyReviewForm
          token={token}
          monthIndex={monthIndex}
          initialContent={(review?.content as Record<string, string | boolean>) ?? {}}
          initialVisibility={(review?.visibility as Visibility) ?? "private"}
        />
      </div>
    </div>
  );
}
