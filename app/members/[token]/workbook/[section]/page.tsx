import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { verifyPortalAccess } from "@/lib/members/portalAuth";
import { getWorkbookSection } from "@/sanity/lib/membersQueries";
import {
  getWorkbookSectionDef,
  WORKBOOK_SECTION_KEYS,
  type WorkbookSectionKey,
} from "@/lib/workbook/sections";
import { WorkbookForm } from "@/components/workbook/WorkbookForm";
import { NeedsSupportFlag } from "@/components/journal/NeedsSupportFlag";
import { CRISIS_RESOURCES } from "@/lib/journal/prompts";

export const metadata = buildMetadata({ noIndex: true });

interface PageProps {
  params: Promise<{ token: string; section: string }>;
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

export default async function WorkbookSectionPage({ params }: PageProps) {
  const { token, section } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <Unavailable />;

  // Validate section key before any auth check.
  if (!(WORKBOOK_SECTION_KEYS as string[]).includes(section)) {
    notFound();
  }
  const sectionKey = section as WorkbookSectionKey;

  const access = await verifyPortalAccess(token);
  if (!access) return <Unavailable />;

  const { clientId, profile } = access;
  const sectionDef = getWorkbookSectionDef(sectionKey);
  if (!sectionDef) notFound();

  // Prefill from Sanity — null means first time opening this section.
  const existing = await getWorkbookSection(clientId, sectionKey);

  // Build initial content: all prompt keys → existing value or empty string.
  const initialContent: Record<string, string> = {};
  for (const p of sectionDef.prompts) {
    initialContent[p.key] =
      (existing?.content as Record<string, string> | undefined)?.[p.key] ?? "";
  }
  const initialVisibility = (existing?.visibility ?? "private") as
    | "private"
    | "shared"
    | "needs-support";

  const isContract = sectionKey === "contract";
  const isSigned = !!existing?.signedAt;

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-10 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/members/${token}/workbook`}
            className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
          >
            ← Workbook
          </Link>
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-3">
              Foundation workbook
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[32px] md:text-[44px] text-ink leading-none">
              {sectionDef.en}
            </h1>
            <p className="text-[14px] text-ink-quiet italic mt-2 font-[family-name:var(--font-body)]">
              {sectionDef.de}
            </p>
          </div>
          {sectionDef.intro && (
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
              {sectionDef.intro}
            </p>
          )}
          {isContract && isSigned && existing?.signedAt && (
            <p className="mt-5 text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
              Signed{" "}
              {new Date(existing.signedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          )}
        </div>
      </section>

      {/* Crisis disclaimer for sensitive sections — shown above the form */}
      {sectionDef.sensitive && (
        <div className="max-w-3xl mx-auto px-6 pt-10">
          <div
            className="border-l-2 border-pink/40 pl-5 py-1 text-[13px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]"
            role="note"
          >
            <span className="block mb-1 text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              A quiet note
            </span>
            {CRISIS_RESOURCES.disclaimer}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <WorkbookForm
          token={token}
          sectionDef={sectionDef}
          clientId={clientId}
          initialContent={initialContent}
          initialVisibility={initialVisibility}
        />
      </div>

      {/* Back navigation */}
      <div className="max-w-3xl mx-auto px-6 pb-16 border-t border-sand/30 pt-8">
        <Link
          href={`/members/${token}/workbook`}
          className="text-[13px] text-plum hover:text-plum-deep transition-colors"
        >
          ← Back to your workbook
        </Link>
      </div>
    </div>
  );
}
