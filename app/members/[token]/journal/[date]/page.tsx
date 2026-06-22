import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { verifyPortalAccess } from "@/lib/members/portalAuth";
import { getJournalEntry } from "@/sanity/lib/membersQueries";
import { MorningRitualForm } from "@/components/journal/MorningRitualForm";
import { EveningReflectionForm } from "@/components/journal/EveningReflectionForm";
import type { Visibility } from "@/lib/journal/prompts";

export const metadata = buildMetadata({ noIndex: true });

interface PageProps {
  params: Promise<{ token: string; date: string }>;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function formatLong(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default async function JournalDay({ params }: PageProps) {
  const { token, date } = await params;

  if (!DATE_RE.test(date)) notFound();
  if (!process.env.MEMBERS_TOKEN_SECRET) notFound();

  const access = await verifyPortalAccess(token);
  if (!access) notFound();

  const { clientId } = access;

  const [morning, evening] = await Promise.all([
    getJournalEntry(clientId, date, "morning"),
    getJournalEntry(clientId, date, "evening"),
  ]);

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
          <Eyebrow className="mt-6 mb-4">{formatLong(date)}</Eyebrow>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-20">
        {/* Morning */}
        <section id="morning" className="scroll-mt-28">
          <p className="font-[family-name:var(--font-display)] text-[30px] text-ink leading-none mb-1">
            Morning ritual
          </p>
          <p className="text-[13px] text-ink-quiet italic mb-8">Morgens</p>
          <MorningRitualForm
            token={token}
            date={date}
            initialContent={(morning?.content as Record<string, string | boolean>) ?? {}}
            initialVisibility={(morning?.visibility as Visibility) ?? "private"}
          />
        </section>

        {/* Evening */}
        <section id="evening" className="scroll-mt-28 border-t border-sand/30 pt-16">
          <p className="font-[family-name:var(--font-display)] text-[30px] text-ink leading-none mb-1">
            Evening reflection
          </p>
          <p className="text-[13px] text-ink-quiet italic mb-8">Abends</p>
          <EveningReflectionForm
            token={token}
            date={date}
            initialContent={(evening?.content as Record<string, string | boolean>) ?? {}}
            initialVisibility={(evening?.visibility as Visibility) ?? "private"}
          />
        </section>
      </div>
    </div>
  );
}
