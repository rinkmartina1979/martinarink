import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import {
  getAudioDropsForClient,
  getMilestonesForClient,
  type MemberAudioDrop,
  type MemberMilestone,
} from "@/sanity/lib/membersQueries";

export const metadata = buildMetadata({ noIndex: true });

interface MembersPageProps {
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  clientId?: string;
  firstName?: string;
  programme?: string;
  archetype?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.ceil(seconds / 60);
  return `${m} min`;
}

/* ── Error state ──────────────────────────────────────────────── */
function ExpiredPage() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-[family-name:var(--font-script)] text-[32px] text-pink leading-none mb-6">
          Unavailable.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          This link has expired or is no longer active. If you believe this is an
          error, please{" "}
          <Link
            href="/contact"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

/* ── Archived (completed) state ────────────────────────────────── */
function ArchivedPage({
  firstName,
  drops,
}: {
  firstName: string;
  drops: MemberAudioDrop[] | null;
  token: string;
}) {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 md:pt-36 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-[family-name:var(--font-script)] text-[36px] md:text-[44px] text-ink leading-none mb-4">
            {firstName}.
          </p>
          <p className="text-[17px] leading-[1.75] text-ink-soft max-w-xl">
            Your programme has concluded. These recordings remain yours — they
            are here whenever you need them.
          </p>
        </div>
      </section>

      {drops && drops.length > 0 && (
        <section className="pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">
              Your recordings
            </p>
            <div className="space-y-4">
              {drops.map((drop) => (
                <div
                  key={drop._id}
                  className="bg-bone border border-sand/40 p-6 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-[16px] text-ink leading-snug">
                      {drop.title}
                    </p>
                    {drop.durationSeconds && (
                      <p className="text-[13px] text-ink-quiet mt-1">
                        {formatDuration(drop.durationSeconds)}
                      </p>
                    )}
                  </div>
                  <p className="text-[12px] text-ink-quiet flex-shrink-0">
                    {formatDate(drop.releasedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────── */
function Dashboard({
  firstName,
  programme,
  drops,
  milestones,
  token,
}: {
  firstName: string;
  programme: string | null;
  drops: MemberAudioDrop[] | null;
  milestones: MemberMilestone[] | null;
  token: string;
}) {
  const latestDrops = (drops ?? []).slice(0, 3);
  const latestMilestones = (milestones ?? []).slice(0, 5);

  return (
    <div className="bg-cream min-h-screen">
      {/* ── Greeting ─────────────────────────────────────────── */}
      <section className="bg-cream pt-28 md:pt-36 pb-12 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          {programme && (
            <Eyebrow className="mb-5">
              {programme.toUpperCase()}
            </Eyebrow>
          )}
          <p className="font-[family-name:var(--font-script)] text-[40px] md:text-[52px] text-ink leading-none">
            Good to see you, {firstName}.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6">
        {/* ── Audio drops ──────────────────────────────────────── */}
        <section className="py-12 border-b border-sand/30">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              Latest recordings
            </p>
            {drops && drops.length > 3 && (
              <Link
                href={`/members/${token}/audio`}
                className="text-[13px] text-plum hover:text-plum-deep transition-colors"
              >
                All recordings →
              </Link>
            )}
          </div>

          {latestDrops.length === 0 ? (
            <p className="text-[15px] text-ink-soft">
              No recordings have been released yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {latestDrops.map((drop) => (
                <div
                  key={drop._id}
                  className="bg-bone border border-sand/40 p-6 flex flex-col"
                >
                  <div className="flex-1">
                    {drop.durationSeconds && (
                      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-quiet mb-2">
                        {formatDuration(drop.durationSeconds)}
                      </p>
                    )}
                    <p className="font-[family-name:var(--font-display)] text-[18px] leading-snug text-ink">
                      {drop.title}
                    </p>
                    {drop.description && (
                      <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft line-clamp-2">
                        {drop.description}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/members/${token}/audio/${drop.slug}`}
                    className="mt-5 self-start text-[13px] text-plum hover:text-plum-deep transition-colors"
                  >
                    Listen →
                  </Link>
                </div>
              ))}
            </div>
          )}

          {drops && drops.length > 3 && (
            <div className="mt-8">
              <Link
                href={`/members/${token}/audio`}
                className="text-[14px] text-plum hover:text-plum-deep transition-colors"
              >
                All recordings →
              </Link>
            </div>
          )}
        </section>

        {/* ── Milestones ────────────────────────────────────────── */}
        {latestMilestones.length > 0 && (
          <section className="py-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">
              Your milestones
            </p>
            <div className="space-y-8">
              {latestMilestones.map((milestone) => (
                <div key={milestone._id} className="flex gap-6">
                  <div className="flex-shrink-0 pt-1">
                    <span className="block w-[1px] self-stretch bg-sand/40" aria-hidden />
                  </div>
                  <div className="flex-1 pb-8 border-b border-sand/20 last:border-0 last:pb-0">
                    <p className="text-[12px] text-ink-quiet mb-2">
                      {formatDate(milestone.achievedAt)}
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
                      {milestone.title}
                    </p>
                    {milestone.note && (
                      <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">
                        {milestone.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default async function MembersPage({ params }: MembersPageProps) {
  const { token } = await params;

  // Verify token via API route
  let verify: VerifyResponse;
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/members/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    verify = await res.json();
  } catch {
    return <ExpiredPage />;
  }

  // Archived / completed programme
  if (!verify.valid && verify.reason === "archived") {
    // Fetch all drops for archived view — we need programme but it isn't in the error response.
    // Show a read-only list without audio links (no programme known).
    return (
      <ArchivedPage
        firstName={verify.firstName ?? ""}
        drops={null}
        token={token}
      />
    );
  }

  // Invalid / expired
  if (!verify.valid || !verify.clientId || !verify.firstName) {
    return <ExpiredPage />;
  }

  const { clientId, firstName, programme } = verify;

  // Fetch portal data in parallel
  const [drops, milestones] = await Promise.all([
    programme ? getAudioDropsForClient(clientId, programme) : Promise.resolve(null),
    getMilestonesForClient(clientId),
  ]);

  return (
    <Dashboard
      firstName={firstName}
      programme={programme ?? null}
      drops={drops}
      milestones={milestones}
      token={token}
    />
  );
}
