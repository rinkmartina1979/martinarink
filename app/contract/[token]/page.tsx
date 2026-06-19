/**
 * /contract/[token]?sig=[hmac]
 *
 * Client-facing contract review and signature page.
 * Server Component — fetches contract from Vercel Blob, verifies HMAC.
 * Renders read-only contract document + client-side signature form.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { notFound } from "next/navigation";
import { head } from "@vercel/blob";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ContractSignForm } from "./ContractSignForm";

export const metadata: Metadata = buildMetadata({
  title: "Coaching Contract — Martina Rink",
  noIndex: true,
});

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ sig?: string }>;
}

interface ContractDraft {
  contractId: string;
  email: string;
  firstName: string;
  programme: string;
  programmeLabel: string;
  serviceDescription: string;
  fee: string;
  deliveryMethod: string;
  location: string | null;
  contractDate: string;
  version: string;
  sentAt: string;
  status: string;
}

function verifySig(contractId: string, email: string, sig: string, secret: string): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${contractId}|${email}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}

export default async function ContractPage({ params, searchParams }: PageProps) {
  const { token: contractId } = await params;
  const { sig = "" } = await searchParams;

  const contractSecret = process.env.CONTRACT_SECRET;
  if (!contractSecret) {
    notFound();
  }

  // Fetch draft blob
  let draft: ContractDraft;
  try {
    const meta = await head(`contracts/drafts/${contractId}.json`).catch(() => null);
    if (!meta) {
      // Check if already signed
      const signed = await head(`contracts/signed/${contractId}.json`).catch(() => null);
      if (signed) {
        return <AlreadySigned />;
      }
      notFound();
    }
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) notFound();
    draft = (await res.json()) as ContractDraft;
  } catch {
    notFound();
  }

  // Verify HMAC
  if (!sig || !verifySig(contractId, draft.email, sig, contractSecret)) {
    notFound();
  }

  // Check expiry — 7 days
  const sentDate = new Date(draft.sentAt);
  const now = new Date();
  const diffDays = (now.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 7) {
    return <Expired />;
  }

  const deliveryDisplay = draft.location
    ? `${draft.deliveryMethod} — ${draft.location}`
    : draft.deliveryMethod;

  return (
    <div className="min-h-screen bg-cream">

      {/* Document header */}
      <header className="bg-[#231727] py-8 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.26em] text-cream/40 mb-1">
              Martina Rink
            </p>
            <p className="font-[family-name:var(--font-display)] italic text-[20px] text-cream leading-tight">
              Coaching Contract
            </p>
          </div>
          <div className="h-px w-10 bg-pink/60" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* Contract ID */}
        <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.2em] text-ink-quiet mb-10">
          Reference: {contractId.slice(0, 8).toUpperCase()}
        </p>

        {/* ── PARTIES ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-5">
            Parties
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-bone p-5 border-l-2 border-pink/40">
              <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-2 font-[family-name:var(--font-body)]">Coach</p>
              <p className="font-[family-name:var(--font-body)] text-[14px] text-ink leading-relaxed">
                Concept Studio Martina Rink UG (haftungsbeschränkt)<br />
                Steinkreuzstr. 26b<br />
                76228 Karlsruhe, Germany<br />
                <span className="text-ink-soft">represented by: Martina Rink</span>
              </p>
            </div>
            <div className="bg-bone p-5 border-l-2 border-sand">
              <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-2 font-[family-name:var(--font-body)]">Customer</p>
              <p className="font-[family-name:var(--font-body)] text-[14px] text-ink leading-relaxed">
                {draft.firstName}<br />
                <span className="text-ink-soft">{draft.email}</span>
              </p>
            </div>
          </div>
        </section>

        <hr className="border-sand my-8" />

        {/* ── SECTION 1: SUBJECT MATTER ─────────────────────── */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
            1. Subject Matter of the Contract
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.75] text-ink-soft">
            The subject of this contract is the provision of coaching services by the coach to support personal development processes, goal achievement and quality of life improvement. The coaching is based on a dialogue based on partnership.
          </p>
        </section>

        <hr className="border-sand my-8" />

        {/* ── SECTION 2: SERVICES ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
            2. Services of the Coach
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.75] text-ink-soft mb-4">
            The coach offers the coaching services agreed in the booking process. The services can take the form of individual sessions, packages, workshops or events. The services are provided either in person, by telephone or online.
          </p>

          <div className="bg-bone p-5 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-2 font-[family-name:var(--font-body)]">Agreed service</p>
            <p className="font-[family-name:var(--font-body)] text-[14px] text-ink leading-[1.75]">
              {draft.serviceDescription}
            </p>
          </div>

          <div className="bg-bone p-5 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-2 font-[family-name:var(--font-body)]">Delivery format</p>
            <p className="font-[family-name:var(--font-body)] text-[14px] text-ink">
              {deliveryDisplay}
            </p>
          </div>

          <p className="font-[family-name:var(--font-body)] text-[14px] leading-[1.75] text-ink-soft">
            The client undertakes to actively participate in the coaching process. The coach expressly does not guarantee success.
          </p>
        </section>

        <hr className="border-sand my-8" />

        {/* ── SECTION 3: REMUNERATION ───────────────────────── */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
            3. Remuneration and Payment
          </h2>
          <div className="bg-bone p-5 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-2 font-[family-name:var(--font-body)]">Investment</p>
            <p className="font-[family-name:var(--font-display)] text-[22px] text-ink">
              {draft.fee}
            </p>
          </div>
          <p className="font-[family-name:var(--font-body)] text-[14px] leading-[1.75] text-ink-soft">
            The customer receives a separate invoice upon conclusion of the contract. Unless otherwise agreed, payment is due in advance by bank transfer or the agreed method after invoicing.
          </p>
        </section>

        <hr className="border-sand my-8" />

        {/* ── SECTION 4: ANNEXES ───────────────────────────── */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
            4. Annexes
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.75] text-ink-soft mb-5">
            The customer confirms that they have received the following annexes, that they have been sufficiently informed in this regard and, in particular, that they agree to the General Terms and Conditions and the Privacy Policy.
          </p>
          <ul className="space-y-3">
            {[
              { label: "Questionnaire (Intake Form)", href: null },
              { label: "General Terms and Conditions", href: "/legal/terms" },
              { label: "Cancellation Policy", href: "/legal/cancellation" },
              { label: "Privacy Policy", href: "/legal/privacy" },
            ].map(({ label, href }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="w-4 h-4 border border-plum/40 bg-plum/10 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5l2 2 4-4.5" stroke="#5C2D8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-[family-name:var(--font-body)] text-[14px] text-ink-soft">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-plum underline decoration-plum/30 hover:decoration-plum transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-sand my-8" />

        {/* ── SIGNATURES ───────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Signatures
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[14px] text-ink-soft mb-8">
            Karlsruhe, {draft.contractDate}
          </p>

          {/* Coach block */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-4 font-[family-name:var(--font-body)]">Coach</p>
              <p className="font-[family-name:var(--font-display)] italic text-[24px] text-ink mb-2">
                Martina
              </p>
              <div className="h-px bg-sand w-full" />
              <p className="mt-2 font-[family-name:var(--font-body)] text-[12px] text-ink-quiet">
                Concept Studio Martina Rink UG
              </p>
            </div>

            {/* Client signature — interactive */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-quiet mb-4 font-[family-name:var(--font-body)]">Customer</p>
              <p className="font-[family-name:var(--font-body)] text-[12px] text-ink-quiet mb-6">
                Type your full name below to sign.
              </p>
            </div>
          </div>
        </section>

        {/* ── SIGNATURE FORM (client-side) ─────────────────── */}
        <ContractSignForm contractId={contractId} sig={sig} firstName={draft.firstName} />

      </main>

      {/* Footer */}
      <footer className="border-t border-sand py-8 px-6 bg-cream">
        <div className="max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-ink-quiet leading-relaxed">
            Concept Studio Martina Rink UG (haftungsbeschränkt) &middot; Steinkreuzstr. 26b, 76228 Karlsruhe, Germany &middot;{" "}
            <a href="https://martinarink.com" className="hover:text-ink transition-colors">
              martinarink.com
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}

function AlreadySigned() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full border border-plum/30 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M4 10.5l4.5 4.5 7.5-9" stroke="#5C2D8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-display)] italic text-[28px] text-ink mb-3 leading-tight">
          Already signed.
        </h1>
        <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)] leading-relaxed">
          This contract has already been signed. A copy was sent to your email address at the time of signing.
        </p>
      </div>
    </div>
  );
}

function Expired() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-[family-name:var(--font-display)] italic text-[28px] text-ink mb-3 leading-tight">
          This link has expired.
        </h1>
        <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)] leading-relaxed">
          Contract links are valid for 7 days. Please write to Martina to request a new link.
        </p>
        <a
          href="mailto:contact@martinarink.com"
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.2em] text-plum font-[family-name:var(--font-body)] hover:text-plum-deep transition-colors"
        >
          contact@martinarink.com
        </a>
      </div>
    </div>
  );
}
