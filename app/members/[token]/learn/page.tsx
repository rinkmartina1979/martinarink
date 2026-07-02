import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getLearnArticles, type LearnArticle } from "@/sanity/lib/membersQueries";
import { deriveEntitlement } from "@/lib/members/entitlements";
import { LinkExpiredView } from "@/components/portal/LinkExpiredView";

export const metadata = buildMetadata({ noIndex: true });

interface LearnPageProps {
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  programme?: string | null;
  firstName?: string;
  depositPaidAt?: string | null;
  manualDepositPaidAt?: string | null;
  finalFeeDueAt?: string | null;
  finalFeePaidAt?: string | null;
  manualFinalFeePaidAt?: string | null;
  programmeActiveAt?: string | null;
  programmeCompletedAt?: string | null;
  accessSuspendedAt?: string | null;
  adminAccessOverride?: boolean | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  physiological: "Physiology",
  hormonal: "Hormones",
  tolerance: "Tolerance & Dependence",
  withdrawal: "Withdrawal",
  social: "Social & Psychological",
  "long-term": "Long-term Health",
  summary: "Summary",
};

function ArticleBlock({ article }: { article: LearnArticle }) {
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

  return (
    <article className="bg-bone border border-sand/30 p-8">
      {/* Eyebrow */}
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
        {categoryLabel}
      </p>

      {/* Title */}
      <h2 className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] text-ink leading-snug mb-6">
        {article.title}
        {article.titleDe && article.titleDe !== article.title && (
          <span className="block text-[18px] md:text-[20px] text-ink-soft mt-1">
            {article.titleDe}
          </span>
        )}
      </h2>

      {/* Body — bilingual */}
      <div className="space-y-6">
        {/* English */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-quiet/60 mb-3">EN</p>
          <p className="text-[15px] leading-[1.8] text-ink-soft font-[family-name:var(--font-body)] whitespace-pre-line">
            {article.bodyEn}
          </p>
        </div>

        {/* German */}
        {article.bodyDe && (
          <div className="border-t border-sand/30 pt-6">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-quiet/60 mb-3">DE</p>
            <p className="text-[15px] leading-[1.8] text-ink-soft font-[family-name:var(--font-body)] whitespace-pre-line">
              {article.bodyDe}
            </p>
          </div>
        )}
      </div>

      {/* Attribution */}
      {article.attribution && (
        <p className="mt-6 pt-4 border-t border-sand/20 text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
          {article.attribution}
        </p>
      )}
    </article>
  );
}

function GatedView({ token }: { token: string }) {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Learn</p>
        <p className="font-[family-name:var(--font-display)] text-[24px] text-ink leading-snug mb-4">
          Clinical resources are not yet available.
        </p>
        <p className="text-[15px] leading-[1.75] text-ink-soft mb-8">
          These materials become available once your consultation deposit is confirmed.
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


export default async function LearnPage({ params }: LearnPageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) {
    return (
      <section className="bg-cream min-h-screen flex items-center justify-center px-6">
        <p className="text-[15px] text-ink-soft">Portal not yet active.</p>
      </section>
    );
  }

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
    return <LinkExpiredView />;
  }

  if (!verify.valid) return <LinkExpiredView reason={verify.reason} />;

  const billingFields = {
    depositPaidAt: verify.depositPaidAt ?? null,
    manualDepositPaidAt: verify.manualDepositPaidAt ?? null,
    finalFeeDueAt: verify.finalFeeDueAt ?? null,
    finalFeePaidAt: verify.finalFeePaidAt ?? null,
    manualFinalFeePaidAt: verify.manualFinalFeePaidAt ?? null,
    programmeActiveAt: verify.programmeActiveAt ?? null,
    programmeCompletedAt: verify.programmeCompletedAt ?? null,
    accessSuspendedAt: verify.accessSuspendedAt ?? null,
    adminAccessOverride: verify.adminAccessOverride ?? null,
  };

  const entitlement = deriveEntitlement(billingFields);
  if (!entitlement.portalAccess) return <GatedView token={token} />;

  const programme = verify.programme ?? "sober-muse";
  const articles = await getLearnArticles(programme);

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-10 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/members/${token}`}
            className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
          >
            ← Portal
          </Link>
          <p className="font-[family-name:var(--font-display)] text-[32px] md:text-[40px] text-ink leading-none mt-6 mb-2">
            Facts about Alcohol & Women
          </p>
          <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)] max-w-xl">
            Clinical research curated for you. Written and reviewed by Ruta Nürnberger, patent engineer and clinical partner.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[15px] text-ink-quiet font-[family-name:var(--font-body)]">
                Martina will add clinical reading materials here as your programme develops.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleBlock key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer note */}
      {articles.length > 0 && (
        <section className="pb-16 px-6">
          <div className="max-w-3xl mx-auto border-t border-sand/30 pt-8">
            <p className="text-[13px] text-ink-quiet leading-[1.7] font-[family-name:var(--font-body)] max-w-lg">
              This content is for educational purposes within your private programme. It is not a substitute for medical advice. If you have concerns about withdrawal or physical symptoms, speak with a qualified physician.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
