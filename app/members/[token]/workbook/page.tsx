import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { verifyPortalAccess } from "@/lib/members/portalAuth";
import { deriveEntitlement } from "@/lib/members/entitlements";
import { getWorkbookProgress } from "@/sanity/lib/membersQueries";
import { groupedSections, WORKBOOK_TOTAL } from "@/lib/workbook/sections";

export const metadata = buildMetadata({ noIndex: true });

interface PageProps {
  params: Promise<{ token: string }>;
}

function Unavailable() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-[family-name:var(--font-script)] text-[32px] text-pink leading-none mb-6">
          Unavailable.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          This link has expired or is no longer active.{" "}
          <Link href="/portal" className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors">
            Request a fresh one.
          </Link>
        </p>
      </div>
    </section>
  );
}

function GatedView({ token }: { token: string }) {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Foundation workbook</p>
        <p className="font-[family-name:var(--font-display)] text-[28px] text-ink leading-snug mb-4">
          Your workbook is not yet available.
        </p>
        <p className="text-[15px] leading-[1.75] text-ink-soft mb-8">
          The foundation workbook opens once your consultation deposit is confirmed.
        </p>
        <Link
          href={`/members/${token}`}
          className="text-[13px] text-plum hover:text-plum-deep transition-colors"
        >
          ← Back to your portal
        </Link>
      </div>
    </section>
  );
}

export default async function WorkbookHubPage({ params }: PageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <Unavailable />;

  const access = await verifyPortalAccess(token);
  if (!access) return <Unavailable />;

  const { clientId, profile } = access;

  const entitlement = deriveEntitlement(profile);
  if (!entitlement.portalAccess) return <GatedView token={token} />;
  const { startedKeys } = await getWorkbookProgress(clientId);
  const started = new Set(startedKeys);
  const groups = groupedSections();
  const total = WORKBOOK_TOTAL;
  const count = startedKeys.length;

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-12 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/members/${token}`}
            className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
          >
            ← Portal
          </Link>
          <p className="mt-8 text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-4">
            Foundation workbook
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] text-ink leading-none">
            {profile.firstName}.
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
            These are the written exercises at the foundation of your programme —
            done once, returned to whenever you need them. Each entry is private unless you choose to share it.
          </p>
          {count > 0 && (
            <p className="mt-5 text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
              {count} of {total} sections started.
            </p>
          )}
        </div>
      </section>

      {/* Sections grouped */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">
        {groups.map((group) => (
          <section key={group.key}>
            <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-7">
              {group.label}
            </p>
            <div className="space-y-3">
              {group.sections.map((section) => {
                const done = started.has(section.key);
                return (
                  <Link
                    key={section.key}
                    href={`/members/${token}/workbook/${section.key}`}
                    className="group flex items-center justify-between gap-4 bg-bone border border-sand/40 px-6 py-5 rounded-[1px] hover:border-plum/40 hover:bg-bone transition-colors duration-200"
                  >
                    <div className="min-w-0">
                      <p className="text-[16px] text-ink leading-snug group-hover:text-ink transition-colors">
                        {section.en}
                      </p>
                      <p className="text-[12px] text-ink-quiet italic mt-0.5">
                        {section.de}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {section.sensitive && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-quiet/60 hidden sm:block">
                          sensitive
                        </span>
                      )}
                      {done ? (
                        <span
                          className="w-5 h-5 flex items-center justify-center"
                          aria-label="Started"
                        >
                          {/* Simple check mark — no Font Awesome */}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 8.5L6.5 12 13 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-plum"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span
                          className="w-5 h-5 rounded-full border border-sand/60 flex-shrink-0"
                          aria-label="Not yet started"
                        />
                      )}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="text-ink-quiet/40 group-hover:text-plum/60 transition-colors"
                      >
                        <path
                          d="M6 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <p className="text-[12px] leading-[1.6] text-ink-quiet/70 font-[family-name:var(--font-body)] border-t border-sand/30 pt-8">
          This workbook is for reflection, not emergencies. If you are in crisis,
          please reach the Telefonseelsorge on 0800 111 0 111 (free, 24/7) or call 112.
        </p>
      </div>
    </div>
  );
}
