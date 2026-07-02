import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { verifyPortalAccess } from "@/lib/members/portalAuth";
import {
  getJournalMonthProgress,
  getJournalEntry,
} from "@/sanity/lib/membersQueries";
import { MonthProgressCard } from "@/components/journal/MonthProgressCard";
import { JournalTodayCard } from "@/components/journal/JournalTodayCard";
import { toDateKey, monthIndexFor } from "@/lib/journal/prompts";
import { LinkExpiredView } from "@/components/portal/LinkExpiredView";

export const metadata = buildMetadata({ noIndex: true });

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function JournalHome({ params }: PageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <LinkExpiredView />;

  const access = await verifyPortalAccess(token);
  if (!access) return <LinkExpiredView />;

  const { clientId, profile } = access;
  const today = toDateKey(new Date());
  const monthIndex = profile.enrolledAt ? monthIndexFor(profile.enrolledAt, today) : 1;

  const [progress, morning, evening] = await Promise.all([
    getJournalMonthProgress(clientId),
    getJournalEntry(clientId, today, "morning"),
    getJournalEntry(clientId, today, "evening"),
  ]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Greeting */}
      <section className="pt-28 md:pt-36 pb-10 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Eyebrow className="mb-5">Your 3-month journal</Eyebrow>
          <p className="font-[family-name:var(--font-script)] text-[40px] md:text-[52px] text-ink leading-none">
            Your private space, {profile.firstName}.
          </p>
          <p className="mt-6 max-w-xl text-[16px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
            A quiet daily ritual — a few minutes in the morning, a few in the evening.
            Each entry is private to you unless you choose to share it.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <MonthProgressCard
          monthIndex={monthIndex}
          mornings={progress.mornings}
          evenings={progress.evenings}
        />

        {/* Today */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Today
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <JournalTodayCard
              title="Morning ritual"
              german="Morgens"
              href={`/members/${token}/journal/${today}#morning`}
              done={!!morning}
            />
            <JournalTodayCard
              title="Evening reflection"
              german="Abends"
              href={`/members/${token}/journal/${today}#evening`}
              done={!!evening}
            />
          </div>
        </section>

        {/* Monthly review */}
        <section className="border-t border-sand/30 pt-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
            Each month
          </p>
          <Link
            href={`/members/${token}/journal/review`}
            className="inline-block text-[15px] text-plum hover:text-plum-deep transition-colors"
          >
            Open your Month {monthIndex} review →
          </Link>
        </section>

        <p className="text-[12px] leading-[1.6] text-ink-quiet/80 font-[family-name:var(--font-body)] border-t border-sand/30 pt-6">
          This space is for reflection, not emergencies. If you are in crisis,
          please reach the Telefonseelsorge on 0800 111 0 111 (free, 24/7) or call 112.
        </p>
      </div>
    </div>
  );
}
